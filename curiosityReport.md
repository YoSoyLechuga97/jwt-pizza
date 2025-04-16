# Curiosity Report: Spotify’s DevOps Team

I've always been a huge fan of music—all types, all sorts of artists, all kinds of sounds. I think you can tell a lot about a person by their playlists. (And for the record, I own more portable speakers than I do bedrooms, which maybe isn't saying much... but still.) All of this is to say: music matters to me, and so does how I get it.

Spotify has been my go-to music app for a long time. I've always been impressed by how smooth their updates are, how solid their song recommendations feel, and how frequently new features pop up. It got me thinking: with nearly **7 million monthly active users**, over **100 million songs**, and around **20,000–60,000 new songs uploaded daily**, how on earth does Spotify manage it all?

Turns out, Spotify is proud of its DevOps team—and for good reason. They’ve dedicated an entire site to blogs, podcasts, and open-source projects for folks like me who want to peek behind the curtain.  
👉 [engineering.atspotify.com](https://engineering.atspotify.com/)  
(Highly recommend checking it out. There’s everything from deep dives into data science personas to large-scale software management strategies.)

For this report, I focused on a standout article titled **“How We Improved Developer Productivity for Our DevOps Teams.”** It connects to several other pieces that offered a wealth of insight into how Spotify builds, tests, and ships at scale.

---

## Squad-Based DevOps

One thing that stood out immediately was how Spotify organizes its engineering teams. Rather than traditional silos, Spotify uses what they call an **“Ops-in-Squad”** model. In this approach, a single team is responsible for a feature from start to finish—front end, back end, testing, deployment, everything. It gives each squad the power to fully own their product and ship faster.

Of course, this freedom isn’t without trade-offs. Spotify acknowledges that this model can lead to **fragmentation**—different teams using different tools or workflows depending on their needs. That’s where Spotify’s investment in automation and internal tools really shines.

They’ve managed to take what used to be a 14-day task (like building a marketing campaign site) and **automate it down to just five minutes**. Let me walk you through some of the tools that make that possible:

---

## Golden Paths

**Golden Paths** started out as a backend initiative but now cover almost every discipline: web, client development, data science, machine learning, even audio processing. Built by eight of Spotify’s top engineers, these paths act like curated blueprints or tutorials to help developers build the _Spotify way_.

Golden Paths aren’t required, but they’re incredibly helpful—especially for onboarding new engineers or for veterans stepping into unfamiliar territory. Some paths even offer templates that set up an entire project structure automatically.

> Think of it as having a GPS for software development—fast, reliable, and hard to get lost.

---

## Tingle (CI/CD)

Spotify uses GitHub for version control (no surprise there), but what’s cool is the internal CI/CD system they developed called **Tingle**. Launched in 2017, Tingle integrates directly into the GitHub workflow to handle build, test, packaging, and deployment—all automatically.

> “Tingle automatically builds, tests, packages, and deploys changes to production in the normal GitHub workflow.” — Spotify Engineering

This means engineers don’t need deep pipeline expertise to get their code shipped. It's consistent, fast, and company-wide—so no matter what team you're on, you know what to expect.

---

## Test-Certification Program

Once a squad finishes a feature, it’s sent off to an infrastructure team for certification. Spotify **gamifies** this process, encouraging developers to write great tests.

When a feature meets all requirements, it **automatically earns a certification badge**—a fun and effective way to promote testing excellence and quality assurance.

---

## Final Thoughts

I’m genuinely impressed by how open Spotify is about its DevOps practices—and how seriously they take automation, developer experience, and testing. From the Golden Paths that help new engineers hit the ground running, to tools like Tingle that streamline deployment, it’s clear Spotify values both innovation and stability.

Honestly, it’s kind of inspiring. Reading about their engineering culture makes me think…  
**Maybe I should send over a résumé sometime 😉**

---

_Thanks for reading!_  
_— Cole Strong_
