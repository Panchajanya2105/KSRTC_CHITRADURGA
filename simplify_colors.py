import os
import re

color_map = {
    # Slate mappings (Light -> White, Mid -> 300/600, Dark -> 900)
    'text-slate-100': 'text-white',
    'text-slate-200': 'text-slate-300',
    'text-slate-400': 'text-slate-300',
    'text-slate-500': 'text-slate-600',
    'text-slate-700': 'text-slate-600',
    'text-slate-800': 'text-slate-900',
    
    # Rose mappings (Light -> 400, Dark -> 600)
    'text-rose-100': 'text-white',
    'text-rose-200': 'text-rose-400',
    'text-rose-300': 'text-rose-400',
    'text-rose-500': 'text-rose-600',
    'text-rose-700': 'text-rose-600',
    'text-rose-800': 'text-rose-600',
    'text-rose-900': 'text-rose-600',

    # Emerald mappings (all to 500 except very light/dark)
    'text-emerald-100': 'text-emerald-500',
    'text-emerald-200': 'text-emerald-500',
    'text-emerald-300': 'text-emerald-500',
    'text-emerald-400': 'text-emerald-500',
    'text-emerald-600': 'text-emerald-500',
    'text-emerald-700': 'text-emerald-500',
    'text-emerald-800': 'text-emerald-500',
    'text-emerald-900': 'text-emerald-500',

    # Sky mappings
    'text-sky-200': 'text-sky-500',
    'text-sky-300': 'text-sky-500',
    'text-sky-400': 'text-sky-500',
    'text-sky-600': 'text-sky-500',
    'text-sky-700': 'text-sky-500',
    'text-sky-900': 'text-sky-500',

    # Amber mappings
    'text-amber-200': 'text-amber-500',
    'text-amber-300': 'text-amber-500',
    'text-amber-400': 'text-amber-500',
    'text-amber-600': 'text-amber-500',
    'text-amber-700': 'text-amber-500',
    'text-amber-900': 'text-amber-500',

    # Indigo/Purple mappings (change to Sky/Rose for consistency)
    'text-indigo-200': 'text-sky-500',
    'text-indigo-300': 'text-sky-500',
    'text-indigo-900': 'text-slate-900',
    'text-purple-200': 'text-rose-400',
    'text-purple-900': 'text-rose-600',
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    # Replace exact class names bounded by non-word chars (like spaces or quotes)
    for old_color, new_color in color_map.items():
        # Match old color if it's bounded by non-word chars
        content = re.sub(r'(?<![a-zA-Z0-9-])' + re.escape(old_color) + r'(?![a-zA-Z0-9-])', new_color, content)
        
    if original != content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src/components'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

