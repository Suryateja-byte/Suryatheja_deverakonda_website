import mammoth
from pathlib import Path
path = Path('assets/docs/resume.docx')
with path.open('rb') as f:
    result = mammoth.convert_to_markdown(f)
print(result.value)
