import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.resolve(ROOT, "data", "resume.normalized.json");
const PUBLIC_OUTPUT_PATH = path.resolve(ROOT, "public", "data", "resume.normalized.json");

const SECTION_KEYWORDS = {
  summary: ["summary", "profile", "professional summary", "objective"],
  experience: ["experience", "professional experience", "work experience", "employment history"],
  projects: ["projects", "case studies", "selected projects"],
  skills: ["skills", "technical skills", "skills & tools", "skills & technologies", "stack"],
  education: ["education", "academic background"],
  testimonials: ["testimonials", "recommendations", "references"],
  certifications: ["certifications", "licenses"],
  publications: ["publications", "articles"],
  awards: ["awards", "honors"],
  volunteering: ["volunteering", "community"],
  blog: ["blog", "articles", "writing"],
};

const resumeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().optional().catch("").default(""),
  summary: z.string().optional().catch("").default(""),
  location: z.string().optional().catch("").default(""),
  email: z.string().email().optional().catch("").default(""),
  phone: z.string().optional().catch("").default(""),
  website: z.string().url().optional().catch("").default(""),
  socials: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      })
    )
    .optional()
    .catch([])
    .default([]),
  skills: z.array(z.string().min(1)).optional().catch([]).default([]),
  projects: z
    .array(
      z.object({
        name: z.string(),
        summary: z.string().optional().catch("").default(""),
        tags: z.array(z.string()).optional().catch([]).default([]),
        highlights: z.array(z.string()).optional().catch([]).default([]),
        links: z
          .object({
            demo: z.string().optional().catch("").default(""),
            code: z.string().optional().catch("").default(""),
          })
          .catch({ demo: "", code: "" }),
      })
    )
    .optional()
    .catch([])
    .default([]),
  experience: z
    .array(
      z.object({
        company: z.string().catch("").default(""),
        role: z.string().catch("").default(""),
        start: z.string().catch("").default(""),
        end: z.string().catch("").default(""),
        location: z.string().optional().catch("").default(""),
        summary: z.string().optional().catch("").default(""),
        bullets: z.array(z.string()).optional().catch([]).default([]),
      })
    )
    .optional()
    .catch([])
    .default([]),
  education: z
    .array(
      z.object({
        school: z.string().catch("").default(""),
        degree: z.string().optional().catch("").default(""),
        year: z.string().optional().catch("").default(""),
      })
    )
    .optional()
    .catch([])
    .default([]),
  testimonials: z
    .array(
      z.object({
        name: z.string().catch("").default(""),
        role: z.string().optional().catch("").default(""),
        quote: z.string().catch("").default(""),
      })
    )
    .optional()
    .catch([])
    .default([]),
});

const CANDIDATE_PATHS = [
  ["data", "resume.json"],
  ["assets", "docs", "resume.json"],
  ["assets", "docs", "resume.normalized.json"],
  ["assets", "docs", "resume.pdf"],
  ["assets", "docs", "resume.txt"],
  ["assets", "docs", "resume.md"],
  ["assets", "docs", "resume.docx"],
];

const dateTokenMap = new Map([
  ["jan", "01"],
  ["january", "01"],
  ["feb", "02"],
  ["february", "02"],
  ["mar", "03"],
  ["march", "03"],
  ["apr", "04"],
  ["april", "04"],
  ["may", "05"],
  ["jun", "06"],
  ["june", "06"],
  ["jul", "07"],
  ["july", "07"],
  ["aug", "08"],
  ["august", "08"],
  ["sep", "09"],
  ["sept", "09"],
  ["september", "09"],
  ["oct", "10"],
  ["october", "10"],
  ["nov", "11"],
  ["november", "11"],
  ["dec", "12"],
  ["december", "12"],
]);

const stripMarkdown = (value) =>
  value
    .replace(/__([^_]+?)__/g, "$1")
    .replace(/\*\*([^*]+?)\*\*/g, "$1")
    .replace(/_([^_]+?)_/g, "$1")
    .replace(/\*([^*]+?)\*/g, "$1")
    .replace(/`([^`]+?)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[\u0000-\u001f]/g, " ")
    .replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " ")
    .replace(/\\+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const detectSectionKey = (line) => {
  if (!line) return undefined;
  const normalized = stripMarkdown(line)
    .toLowerCase()
    .replace(/[^a-z&\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const entry = Object.entries(SECTION_KEYWORDS).find(([, keywords]) =>
    keywords.some((keyword) => normalized === keyword || normalized.startsWith(keyword))
  );
  return entry ? entry[0] : undefined;
};

const looksLikeContact = (line) =>
  /@|linkedin|github|gitlab|portfolio|https?:\/\//i.test(line) || /(\+?\d[\d\s().-]{6,}\d)/.test(line);

const sanitizeLine = (line) => stripMarkdown(line.replace(/^[\u2022•\-·]+\s*/, ""));

const splitEmphasisSegments = (line) => {
  const trimmed = line.trim();
  if (!trimmed) return [];
  const bulletMatch = trimmed.match(/^[\u2022•\-·]+\s*/);
  const bullet = bulletMatch ? bulletMatch[0] : "";
  const content = bullet ? trimmed.slice(bullet.length) : trimmed;
  const segments = [];
  const regex = /(__|\*\*)([^*_]+?)\1/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const before = content.slice(lastIndex, match.index).trim();
    if (before) segments.push(before);
    const heading = match[2].trim();
    if (heading) segments.push(heading);
    lastIndex = regex.lastIndex;
  }
  const after = content.slice(lastIndex).trim();
  if (after) segments.push(after);
  if (!segments.length) segments.push(content.trim());
  if (bullet) {
    segments[0] = `${bullet}${segments[0]}`;
  }
  return segments;
};

const toParagraphs = (lines) =>
  lines
    .join("\n")
    .split(/\n{2,}/)
    .map((chunk) =>
      chunk
        .split(/\n/)
        .map((part) => part.trim())
        .filter(Boolean)
    )
    .filter((group) => group.length > 0);

const parseDateRange = (text) => {
  if (!text) return { start: "", end: "" };
  const rangeRegex = /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*?\s+\d{4}|\d{4})(?:\s*[–-]\s*)((?:present|current)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*?\s+\d{4}|\d{4})/i;
  const match = text.match(rangeRegex);
  if (!match) return { start: "", end: "" };
  const startRaw = match[1];
  const endRaw = match[2];
  return {
    start: normalizeDateToken(startRaw),
    end: normalizeDateToken(endRaw),
  };
};

const normalizeDateToken = (token) => {
  if (!token) return "";
  const lower = token.toLowerCase().trim();
  if (lower === "present" || lower === "current") return "Present";
  if (/^\d{4}$/.test(lower)) return `${lower}-01`;
  const parts = lower.split(/\s+/);
  const maybeMonth = parts[0];
  const maybeYear = parts[1];
  const month = dateTokenMap.get(maybeMonth || "");
  if (!month || !/^\d{4}$/.test(maybeYear || "")) return "";
  return `${maybeYear}-${month}`;
};

const parseSocials = (text) => {
  const socials = [];
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const labelRegex = /(linkedin|github|gitlab|behance|dribbble|twitter|x\.com|medium|substack)/i;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1];
    const labelMatch = url.match(labelRegex);
    const label = labelMatch ? labelMatch[1] : "Website";
    socials.push({ label: formatLabel(label), url });
  }
  return socials;
};

const formatLabel = (label) =>
  label
    .replace(/[_.-]/g, " ")
    .replace(/https?:\/\//i, "")
    .replace(/www\./i, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const extractContacts = (lines) => {
  const joined = lines.join(" • ");
  const emailMatch = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = joined.match(/(\+?\d[\d\s().-]{6,}\d)/);
  const urlMatch = joined.match(/(https?:\/\/[^\s]+)/i);
  let location = "";
  const locationCandidate = lines.find((line) => /[A-Za-z]+,\s*[A-Za-z]+/.test(stripMarkdown(line)) && !looksLikeContact(line));
  if (locationCandidate) location = stripMarkdown(locationCandidate);
  const socials = parseSocials(joined);

  const website = urlMatch ? urlMatch[1] : "";
  const filteredSocials = socials.filter((social) => social.url !== website);

  return {
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0].replace(/\s+/g, " ") : "",
    website,
    socials: filteredSocials,
    location,
  };
};

const parseSkills = (lines) => {
  if (!lines.length) return [];
  const raw = lines
    .join(", ")
    .split(/[,|•·\-]/)
    .map((skill) => sanitizeLine(skill))
    .filter((skill) => skill.length > 1);
  return Array.from(new Set(raw));
};

const parseExperience = (lines) => {
  const groups = toParagraphs(lines);
  return groups
    .map((group) => {
      if (!group.length) return undefined;
      const header = group[0];
      const { company, role, location } = parseRoleCompany(header, group.slice(1));
      const dates = parseDateRange(group.join(" "));
      const details = group.slice(1);
      const bullets = [];
      const summaryParts = [];
      details.forEach((line) => {
        if (/^[-•·]/.test(line)) {
          bullets.push(sanitizeLine(line));
        } else if (!/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)/i.test(line)) {
          summaryParts.push(sanitizeLine(line));
        }
      });
      return {
        company: sanitizeLine(company),
        role: sanitizeLine(role),
        location: sanitizeLine(location),
        start: dates.start,
        end: dates.end,
        summary: stripMarkdown(summaryParts.join(" ")), 
        bullets,
      };
    })
    .filter(Boolean);
};

const parseRoleCompany = (header, restLines) => {
  const cleaned = stripMarkdown(header.replace(/\u2022|•/g, ""));
  const dateLess = cleaned.replace(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[^|]+(?:Present|\d{4}))/gi, "").trim();
  const dividerMatch = dateLess.split(/\s*[–\-|@]\s*/);
  let role = "";
  let company = "";
  let location = "";
  if (dividerMatch.length >= 2) {
    company = dividerMatch[0];
    role = dividerMatch.slice(1).join(" - ");
  } else if (dateLess.includes(" at ")) {
    const parts = dateLess.split(/\s+at\s+/i);
    role = parts[0];
    company = parts[1] || "";
  } else {
    role = dateLess;
  }
  const locationLine = restLines.find((line) =>
    /(Remote|USA|United|India|Europe|Asia|Africa|America|Australia|Canada|UK|United Kingdom)/i.test(line)
  );
  if (locationLine) location = stripMarkdown(locationLine);
  return {
    company,
    role,
    location,
  };
};

const parseProjects = (lines) => {
  const entries = [];
  let current = null;

  const finalize = () => {
    if (!current) return;
    if (!current.summary && current.highlights.length) {
      current.summary = current.highlights[0];
      current.highlights = current.highlights.slice(1);
    }
    current.tags = Array.from(new Set(current.tags));
    entries.push(current);
    current = null;
  };

  const createFromHeading = (raw) => {
    const cleaned = sanitizeLine(raw);
    const techMatch = cleaned.match(/\(([^)]+)\)/);
    const tags = techMatch
      ? techMatch[1]
          .split(/[\\/|,]/)
          .map((tag) => sanitizeLine(tag))
          .filter(Boolean)
      : [];
    const yearMatch = cleaned.match(/[—–-]\s*(\d{4})/);
    const name = cleaned
      .split(/[—–-]\s*\d{4}/)[0]
      .split(/\s*\(/)[0]
      .trim();
    return {
      name: name || cleaned,
      summary: "",
      tags,
      highlights: [],
      links: {
        demo: extractFirstUrl([raw], /demo|live|app|case|preview/i),
        code: extractFirstUrl([raw], /code|repo|github|gitlab/i),
      },
    };
  };

  lines.forEach((line) => {
    const raw = line.trim();
    if (!raw) return;
    const isBullet = /^[-•·]/.test(raw);
    if (!isBullet) {
      finalize();
      current = createFromHeading(raw);
      return;
    }
    if (!current) return;
    const cleaned = sanitizeLine(raw);
    if (!cleaned) return;
    if (!current.summary) {
      current.summary = cleaned;
    } else {
      current.highlights.push(cleaned);
    }
    if (/(https?:\/\/)/i.test(raw)) {
      const demo = extractFirstUrl([raw], /demo|live|app|case|preview/i);
      const code = extractFirstUrl([raw], /code|repo|github|gitlab/i);
      if (demo && !current.links.demo) current.links.demo = demo;
      if (code && !current.links.code) current.links.code = code;
    }
  });

  finalize();
  return entries;
};

const extractFirstUrl = (lines, hintRegex) => {
  for (const raw of lines) {
    const line = String(raw);
    if (hintRegex.test(line)) {
      const match = line.match(/(https?:\/\/[^\s]+)/i);
      if (match) return match[1];
    }
  }
  const fallback = lines
    .map((raw) => {
      const match = String(raw).match(/(https?:\/\/[^\s]+)/i);
      return match ? match[1] : "";
    })
    .find((url) => url);
  return fallback || "";
};

const parseEducation = (lines) => {
  const groups = toParagraphs(lines);
  return groups
    .map((group) => {
      if (!group.length) return undefined;
      const first = sanitizeLine(group[0]);
      const rest = group.slice(1).map((line) => sanitizeLine(line));
      const degreeLine = rest.find((line) => /(Bachelor|Master|B\.Sc|M\.Sc|Bachelors|Masters|Diploma|Associate)/i.test(line));
      const yearMatch = group.join(" ").match(/(\d{4})(?:\s*[–-]\s*(\d{4}|Present))/i);
      return {
        school: first,
        degree: degreeLine || rest[0] || "",
        year: yearMatch ? yearMatch[0] : "",
      };
    })
    .filter(Boolean);
};

const parseTestimonials = (lines) => {
  const groups = toParagraphs(lines);
  return groups
    .map((group) => {
      if (group.length < 2) return undefined;
      const quote = group.slice(0, -1).map((line) => sanitizeLine(line)).join(" ");
      const attribution = sanitizeLine(group[group.length - 1]);
      const parts = attribution.split(/\s*[–-]\s*/);
      return {
        name: parts[0] ? parts[0].trim() : "",
        role: parts[1] ? parts[1].trim() : "",
        quote,
      };
    })
    .filter(Boolean);
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractSkillsFromSummary = (summaryTail) => {
  if (!summaryTail) return [];
  const categories = [
    "Languages & Libraries",
    "MLOps & Cloud",
    "Data & Storage",
    "LLM/RAG",
    "Methods",
    "Practices",
  ];
  const categoryPattern = categories.map(escapeRegExp).join("|");
  const pattern = new RegExp(`(${categoryPattern}):\\s*([\\s\\S]*?)(?=(?:${categoryPattern}):|$)`, "gi");
  const collected = [];
  let match;
  while ((match = pattern.exec(summaryTail)) !== null) {
    const base = sanitizeLine(match[2]);
    const items = base
      .split(/[,;•]| and /i)
      .flatMap((item) => {
        const cleaned = sanitizeLine(item);
        const inside = [...cleaned.matchAll(/\((.*?)\)/g)].flatMap((inner) =>
          inner[1]
            .split(/[,/]/)
            .map((token) => sanitizeLine(token))
            .filter(Boolean)
        );
        const withoutParens = cleaned.replace(/\(.*?\)/g, "").trim();
        return [withoutParens, ...inside];
      })
      .map((value) => value.trim())
      .filter(Boolean);
    collected.push(...items);
  }
  return Array.from(new Set(collected)).filter(Boolean);
};

const parseResumeText = (rawText) => {
  const emphasisedBoundary = rawText.replace(/(__|\*\*)([^*_]+?)\1/g, "\n$2\n");
  const cleaned = emphasisedBoundary.replace(/\r/g, "\n");
  const rawLines = cleaned
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rawLines.length) {
    throw new Error("Resume text is empty.");
  }

  const processedLines = rawLines.flatMap((line) => splitEmphasisSegments(line));
  const lines = processedLines.map((line) => line.trim()).filter(Boolean);

  const sections = new Map();
  sections.set("summary", []);

  const firstLine = stripMarkdown(lines.shift() || "");
  let title = "";
  const preamble = [];

  while (lines.length) {
    const peek = lines[0];
    if (detectSectionKey(peek)) break;
    if (!title && !looksLikeContact(peek)) {
      title = stripMarkdown(peek);
      lines.shift();
      continue;
    }
    preamble.push(lines.shift());
    if (preamble.length > 6) break;
  }

  const contacts = extractContacts(preamble);

  let currentKey = "summary";
  lines.forEach((line) => {
    const key = detectSectionKey(line);
    if (key) {
      currentKey = key;
      if (!sections.has(currentKey)) {
        sections.set(currentKey, []);
      }
      return;
    }
    if (!sections.has(currentKey)) {
      sections.set(currentKey, []);
    }
    sections.get(currentKey).push(line);
  });

  const summaryLines = sections.get("summary");
  let summaryComposite = summaryLines.length ? summaryLines.map((line) => sanitizeLine(line)).join(" ") : stripMarkdown(preamble.join(" "));
  let summaryTail = "";
  const splitByCore = summaryComposite.split(/CORE SKILLS/i);
  if (splitByCore.length > 1) {
    summaryTail = splitByCore.slice(1).join(" CORE SKILLS ");
    summaryComposite = splitByCore[0].trim();
  }
  summaryComposite = summaryComposite
    .replace(/\s+([,.;])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+\+/g, "+")
    .replace(/\+\s+/g, "+")
    .replace(/\s+/g, " ")
    .trim();

  let skills = parseSkills(sections.get("skills") || []);
  if (!skills.length) {
    skills = extractSkillsFromSummary(summaryTail);
  }

  const experience = parseExperience(sections.get("experience") || []);
  const projects = parseProjects(sections.get("projects") || []);
  const education = parseEducation(sections.get("education") || []);
  const testimonials = parseTestimonials(sections.get("testimonials") || []);

  return {
    name: firstLine,
    title,
    summary: summaryComposite,
    location: contacts.location,
    email: contacts.email,
    phone: contacts.phone,
    website: contacts.website,
    socials: contacts.socials,
    skills,
    projects,
    experience,
    education,
    testimonials,
  };
};

const normalizeResume = (data) => {
  const parsed = resumeSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Resume data failed validation: ${parsed.error.message}`);
  }
  return parsed.data;
};

const ensureDir = async (dirPath) => {
  await mkdir(dirPath, { recursive: true });
};

const fileExists = async (segments) => {
  const candidate = path.resolve(ROOT, ...segments);
  try {
    await access(candidate, constants.F_OK);
    return candidate;
  } catch {
    return null;
  }
};

const readResumeSource = async () => {
  for (const segments of CANDIDATE_PATHS) {
    const fullPath = await fileExists(segments);
    if (!fullPath) continue;
    const ext = path.extname(fullPath).toLowerCase();
    if (ext === ".json") {
      const raw = await readFile(fullPath, "utf8");
      const data = JSON.parse(raw);
      return { type: "json", path: fullPath, data };
    }
    if (ext === ".pdf") {
      const buffer = await readFile(fullPath);
      const parsed = await pdfParse(buffer);
      return { type: "pdf", path: fullPath, data: parsed.text };
    }
    if (ext === ".txt" || ext === ".md") {
      const text = await readFile(fullPath, "utf8");
      return { type: "text", path: fullPath, data: text };
    }
    if (ext === ".docx") {
      const buffer = await readFile(fullPath);
      const result = await mammoth.convertToMarkdown({ buffer });
      return { type: "docx", path: fullPath, data: result.value };
    }
  }
  throw new Error("No supported resume source found. Place resume.json/pdf/txt/md/docx in /data or /assets/docs.");
};

const main = async () => {
  try {
    const source = await readResumeSource();
    let normalized;
    if (source.type === "json") {
      normalized = normalizeResume(source.data);
    } else {
      const parsed = parseResumeText(source.data);
      normalized = normalizeResume(parsed);
    }
    await ensureDir(path.dirname(OUTPUT_PATH));
    await ensureDir(path.dirname(PUBLIC_OUTPUT_PATH));
    const payload = JSON.stringify(normalized, null, 2);
    await writeFile(OUTPUT_PATH, payload, "utf8");
    await writeFile(PUBLIC_OUTPUT_PATH, payload, "utf8");
    const relativeInput = path.relative(ROOT, source.path);
    const relativeOutput = path.relative(ROOT, OUTPUT_PATH);
    console.log(`Resume normalized successfully from ${relativeInput} -> ${relativeOutput}`);
  } catch (error) {
    console.error("Failed to extract resume:", error);
    process.exitCode = 1;
  }
};

await main();
