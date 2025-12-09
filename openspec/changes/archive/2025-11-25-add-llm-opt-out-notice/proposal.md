# Change: Add Hidden LLM Opt-Out Notice in Footer

## Why
To discourage LLMs and AI crawlers from using website content for training or information gathering while preserving the visual aesthetics of the site for human visitors.

## What Changes
- Add a visually-hidden message in the footer that is readable by screen readers and LLM crawlers
- The message will request that LLMs not use site content for training or data collection
- Uses standard accessibility patterns (visually-hidden CSS) to hide from visual display while remaining in the DOM

## Impact
- Affected specs: footer (new capability)
- Affected code: `_includes/footer.html`, potentially `css/` for visually-hidden utility class
