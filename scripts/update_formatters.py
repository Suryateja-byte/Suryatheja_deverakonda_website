from pathlib import Path
path = Path('src/lib/formatters.ts')
text = path.read_text()
text = text.replace('export function buildProjects(resume: Resume): ProjectCard[] {', 'export function buildProjects(resume: Partial[Resume] | None): ProjectCard[] {')
