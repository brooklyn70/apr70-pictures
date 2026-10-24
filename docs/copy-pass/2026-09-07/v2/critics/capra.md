<!-- ROUND 2 | chair: capra | seat: free | model: openrouter/free | provider: openrouter | tokens in/out: 35820/5721 | max_tokens: 14000 | cost: $0.0000 | 2026-09-07T18:08:11 | 156s -->

**VERDICT — 7/10 (Round 1: 6/10) — would_advance: True**

The picture moves. The writer’s voice comes through cleaner now. The slogans that cluttered the lobby have been swept up or pushed to the margins where they belong. The audience in row ten leans forward when the copy gets specific — *Borough Park, summer ’86*, *Sea Gate, one road in*, *Staten Island to Little Italy*, *a face held long enough to matter*. They sit back when the copy explains itself. The `==Title==` markup bleeding into public captions is a boom mic in the shot. The Craft page still lectures on drama instead of showing it. But the spine holds. Ten properties. One writer. The machine labeled and kept below the line. This is a solid base worth building on. It advances.

**THE PEOPLE**

The voice running the site — Marco — sounds like a man who has checked the gates himself. *Marco Caruso writes the scripts.* *Ten properties. One writer responsible for every page.* *One note. One role. One link.* That is a person, not a mission statement. The characters in the slate pages breathe. Marc on the stoop with his lemon ice. Jim Lang in the flooded basement, the dry life vest on the nail. Cleo Modica waking in Sicily, in Poland, in Tokyo, the cigarette standing on end. Mike and Dario collecting on the ferry, the kites coming up from the yard. They have addresses. They have weather. They have bills coming due. The crowd — the audience — is treated as adults who can add two plus two. The Lubitsch/Wilder quote on *L.A. Dolce Vita* earns its keep. The Chekhov rifle on *Sea Gate* earns its keep. The only cardboard cutout is the abstract noun parade that used to live on the Craft page; it has mostly been fired.

**EARNED OR ASSERTED**

*Earned (staged by behavior at a cost):*
- *A face held long enough to matter* — the camera earns its movement, the cut earns its place.
- *Ten properties. One writer responsible for every page* — the count is on the wall.
- *Machines render the development frames. People write the story* — the division of labor shown, not told.
- *Pay for the work themselves* (Alpha YY) — the bill comes due in the logline.
- *Which life she keeps, and which family she wakes up without* (Cleopatra) — the choice laid out concrete.
- *What happened to the city they built?* (The Mayors) — the question lets the audience draw the verdict.
- *The dominoes were falling from the opening frame* (A Need Grows in Brooklyn) — the structure felt in the bones.

*Asserted (corn the script demands you swallow):*
- *Here the story does the heavy lifting* (Home) — a lecture before the image.
- *Drama over information. Subtext over statement* (Craft) — two slogans where one held face would do.
- *Boundaries are where our best work comes from* (Methods) — the principle explained instead of demonstrated.
- *Structural negative space* (A Need Grows in Brooklyn layout) — writer jargon on the screen.
- *A Ric Burns homage* (The Mayors) — a name drop doing the work of description.
- *Unseen war across dimensions / salvation or destruction* (Cleopatra layout) — vague stakes for a concrete character.

**THE MACHINE AND THE CROWD**

The machine — AI generation, disclosure, the below-the-line render farm — has real teeth. It is named, caged, and credited on every frame. *AI-generated development frame* repeats like a watermark. The crowd — the reader, the requester, the future audience — is respected. *The pages go out one reader at a time.* *The reply comes from the writer.* *Say who you are and in what capacity you are asking.* The turn is earned: the site does not shout for attention; it wagers *meet people where they already are.* The machine does not swallow the story. The people keep the story.

**THE AUDIENCE VERDICT**

The house laughs at *One note. One role. One link.* They lean in at *Borough Park, summer 1986* and *Sea Gate, one road in* and *Staten Island to Little Italy, collecting.* They check their watches at *Drama over information. Subtext over statement* and at the `==L.A. Dolce Vita==` markup glowing in the captions — they see the wires. The scene they tell somebody about tomorrow: *A face held long enough to matter.* Or the gun sliding off the dashboard in Borough Park. Or the dry life vest on the nail in Sea Gate. The specific image. The behavior that costs.

**THE DETAILED FIXES**

1. **Home / sections.2.body** — *Here the story does the heavy lifting.*  
   Why it fails: The line explains the picture instead of letting the picture play. The next sentence *A face held long enough to matter* is the image. The explanation steps on it.  
   Fix: Cut *Here the story does the heavy lifting.* Open the paragraph on *A face held long enough to matter.* Let the image stand alone.

2. **Craft / sections.4.body** — *Drama over information. Subtext over statement.*  
   Why it fails: Two slogans masquerading as principles. The very next sentence *The camera earns its movement; the cut earns its place* demonstrates the principle in behavior. The slogans are corn.  
   Fix: Delete the two slogan sentences. Start the paragraph at *The camera earns its movement; the cut earns its place. We would rather hold a face for four seconds than cut three times to prove we were there. The classics never go out of style.*

3. **Global captions (Home sections.0.caption, Craft sections.0.caption, Slate sections.0.caption, Contact sections.3.caption)** — *==L.A. Dolce Vita==* (and *==A Need Grows in Brooklyn==*).  
   Why it fails: The markup brackets are visible scaffolding. The audience sees the boom mic.  
   Fix: Render the title clean: *L.A. Dolce Vita* and *A Need Grows in Brooklyn*. No brackets. No equals signs. The slate pages already carry the proper title in the heading.

4. **A Need Grows in Brooklyn / layout.0.body** — *the El train as structural negative space.*  
   Why it fails: Writer shorthand on the screen. The audience does not read the shooting script.  
   Fix: *The El train cuts the frame* or *The El train looms over every shot.* Concrete. Visual. Spoken.

5. **Methods / sections.4.body** — *A disclosure rule is a boundary, and boundaries are where our best work comes from.*  
   Why it fails: The principle announced instead of lived. The next sentence *Machines render the development frames. People write the story* lives it.  
   Fix: *A disclosure rule is a boundary. We do our best work at the boundary. Machines render the development frames. People write the story.*

6. **The Mayors / layout.0.body** — *a Ric Burns homage.*  
   Why it fails: A name drop substitutes for the method. The method is already described: *cinéma vérité with archival material and contemporary interviews, each era rendered in its own visual grammar.*  
   Fix: Cut *a Ric Burns homage.* Let the description stand. The audience knows the register when they see it.

**RULING FOR MARCO**

Cut the lectures. Trust the images. Scrub the markup from the captions. The audience is already leaning forward — don't step in front of the screen to tell them what they're feeling.
