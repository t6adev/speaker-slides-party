# Speaker Slides Party

It's a presentation slides app for event's organizers, speakers, and attendees. (It's not an app to make a presentation slide.)  
Organizers must manage the speaker's session time and avoid wasting time on troubles. I believe it works well for a lightning talk event.  
Make your event more precious time for all!!

## Core Features

- 💻 One laptop for an event to show all speakers' slides (Now supported only pdf file)
- ⏳ Timer to control time table
- 🎈 Realtime reactions for hyping an event by confetti (No longer silent, thanks to [partykit](https://www.partykit.io/))

## Preparation

- 1. Make `/pdfs` directory at the root and put speaker's info and pdf file
  - A directory need to have `info.json` and `presentation.pdf`
  - Directories like:
    ```
      /pdfs
        /speaker1
          /info.json
          /presentation.pdf
        /speaker2
          /info.json
          /presentation.pdf
        /speaker3
          /info.json
          /presentation.pdf
    ```
  - info.json has properies below:
    - title: Speaker's presentation title
    - speaker info(name, description, imageUrl, and links)
    - appendixLinks: For the presentation appendix
    - e.g.
      ```
      {
        "title": "Great DX with Waku",
        "speaker": {
          "name": "Daishi",
          "description": "React library author, maintaining three state management libraries, Zustand, Jotai, Valtio, and React Server Components framework, Waku.",
          "imageUrl": "https://pbs.twimg.com/profile_images/1610832991626088449/rD4NZ7Do_400x400.png",
          "links": ["https://daishikato.com/"]
        },
        "appendixLinks": ["https://waku.gg", "https://jotai.org", "https://zustand-demo.pmnd.rs/"]
      }
      ```
- 2. Run the script to generate `loader.ts`
  ```
  pnpm generate-pdf-loader
  ```
- 3. Edit `presentation.config.ts` for your event

### Deployment

You can deploy your project to partykit or your own cloudflare account. See more details [here](https://docs.partykit.io/guides/deploy-to-cloudflare/)

Build your project before deploy,

```
pnpm build
```

Then, deyploy it. If you'd like to deploy to your own cloudflare account, run the command like below:

```
CLOUDFLARE_ACCOUNT_ID=<your account id> CLOUDFLARE_API_TOKEN=<your api token> npx partykit deploy --domain yourprojectname.yourcloudflaresubdomain.workers.dev
```

## Local development

We have two patterns to run it on local,

- a. Run `pnpm dev-waku` without partykit features
- b. Run `pnpm dev-partykit` with partykit feature (Required build commnad before)
