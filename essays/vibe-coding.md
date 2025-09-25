---
layout: essay
type: essay
title: "I added an `AGENTS.md` file to all my repos"
date: 2025-09-25
published: true
labels:
  - Tools
  - Vibe coding
---

I fully embraced vibe coding now. After being hyperjudgmental about *"AI slop"* for the past few months, and secretly being pretentious about being "a real programmer who knows how code work instead of just writing prompts", I tried ~~Gemini CLI~~, ~~Claude Code~~, OpenAI Codex (I've always used GitHub Copilot, I don't even consider that vibe coding anymore.). 

<div class="col-12 col-lg-8 mx-auto my-3">
  <img src="/img/vibe-coding/cover.png" alt="Now Playing API Logic" class="img-fluid rounded">
</div>

I am still trying to take it critically: always do `AGENTS.md`, then `STEPS.md`, add human-in-the-loop checking, appending `remember less is more, keep it simple and always see if there's existing code that can be reused instead of implementing new structures` after every one of my prompt. But there's no doubt that vibe coding, especially in my current line of work data analysis and bioinformatics, where there is a lot of one time code that will never get reused ever again, excels and saves countless time without the 4 hour mandatory vibe debugging. Who wants to remember the documents on how to change the font size of the xaxis on the 3rd plot in a matplotlib figure?

But there is a fine line between *AI can help me make a large seaborn plot without me going through the docs for half a day* and *Just type the app you want and an AI can ship in 3 seconds*. In this AI hype, it feels like I would lose my job in 3 seconds. But part of me still believes that there will always be places where truly knowing a coding language is important: not just the part where you create something, **the part where you learn how to fix broken stuff**. For me, writing new stuff is far easier than troubleshooting one that doesn't, and all my skillset on debugging: gdb, lldb, pdb, VSCode debugger took me a painstaking amount of time to learn. The only reason why I invested the time to learn how to do those things are because I wrote those code myself, and I believe it is worth saving. Now, I do not bother to fire up a debugger for something an LLM generated in 5 minutes: If it works, it works. if it doesn't, just write a better prompt and roll back your codebase. 

At a certain point though, all the vibe code piled up would eventually tip over and bite back whoever is trying to use the codebase. I've had it a few times to me, and unfortunately a few times for when I am trying to help other people. In those tough times where I stare at my screen for hours, I found those extra time I spend in the debugger and learning quirks of a programming language, things that vibe coding does not teach me, actually gave me the ability to troubleshoot and fix problem caused by vibe coding. It was at one of those nights I came to the realization: Surely AI wrote those code for me, but it does not make me useless.  

So there is that, now I use codex, I prompt engineer, and I only look at `git diff` and run my tests before pushing to `dev`. Knowing that I have the skillset of what it takes to vibe-debug, and hopefully that would keep me in my job. That mix—vibe coding for speed, debugging for depth—feels like the balance I want to keep honing. 