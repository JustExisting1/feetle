import infinite from "./infinite.jpeg";
import health from "./health.jpeg";
import timed from "./timed.jpeg";
import { NavLink } from "react-router";

export default function HomePage() {
  return (
    <div className="bg-[url(/background.png)] min-h-dvh w-screen bg-cover bg-center ">
      <div className="flex flex-col w-screen min-h-dvh place-content-between place-self-center font-display p-2 gap-2">
        <div className="flex flex-col w-full h-full 2xl:w-3/5 place-items-center place-self-center">
          <h1 className="text-7xl my-8">Feetle</h1>
          <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 w-4/5 p-2 gap-4 place-items-center">
            <GamemodeCard
              modeUrl="/infinite"
              title="Infinite"
              content="Endless fun! 
            Identify as many feet as you want in a relaxed gamemode."
              imgUrl={infinite}
            />
            <GamemodeCard
              modeUrl="/timed"
              title="Timed"
              content="Race against time!
            Identify as many feet as you can within a limited time period."
              imgUrl={timed}
            />
            <GamemodeCard
              modeUrl="/health"
              title="Health"
              content="Play with lives!
            Identify as many feet as you can. Each wrong guess loses you a life."
              imgUrl={health}
            />
          </div>
        </div>

        <footer
          className="flex flex-col gap-4 place-self-center p-2
        border-2 border-league-gold rounded-2xl bg-gradient-to-b from-[#011744]/40 from-40% to-[#091428]/40">
          <div className="border-b-1 w-full md:w-2/3 self-center text-center border-league-gold pb-2">
            <NavLink
              to="/faq"
              end
              className="text-[#9191E0] hover:underline visited:text-[#4b187c] text-xl w-fit place-self-center">
              FAQ
            </NavLink>
          </div>
          <div className="flex flex-col md:flex-row gap-1">
            <DevCard
              name="JustExisting1"
              title="Frontend Developer"
              content="Rewrote the site in react/tailwindcss"
              links={[
                {
                  iconUrl: "/icons/github-mark-white.png",
                  hrefLink: "https://github.com/JustExisting1",
                },
              ]}
            />
            <DevCard
              name="Parzi"
              title="Author Developer"
              links={[
                {
                  iconUrl: "/icons/github-mark-white.png",
                  hrefLink: "https://github.com/parzivalhaliday",
                },
                {
                  iconUrl: "/icons/instagram.png",
                  hrefLink: "https://www.instagram.com/parzivalhaliday",
                },
                {
                  iconUrl: "/icons/x-logo-white.png",
                  hrefLink: "https://x.com/parzivalhaliday",
                },
              ]}
              content={
                <p>
                  For bug reports or questions, please{" "}
                  <a
                    className="text-[#9191E0] hover:underline visited:text-[#4b187c]"
                    href="mailto:parzivalhaliday@protonmail.com"
                    target="_blank"
                    rel="noopener noreferrer">
                    click here
                  </a>
                  .
                </p>
              }
            />
            <DevCard
              name="AlperShal"
              title="Backend Developer"
              links={[
                {
                  iconUrl: "/icons/github-mark-white.png",
                  hrefLink: "https://github.com/AlperShal/",
                },
                {
                  iconUrl: "/icons/In-Blue.png",
                  hrefLink: "https://www.linkedin.com/in/AlperShal/",
                },
              ]}
            />
          </div>
          <div className="border-t-1 pb-3 border-league-gold flex flex-col w-full md:w-2/3 self-center text-center text-white gap-1 p-1">
            <h2 className="text-red-600 text-xl">Disclaimer</h2>
            <p className="text-xs">
              Disclaimer: feetle.lol is not endorsed by Riot Games nor does it
              reflect their views, opinions, or those of anyone officially
              involved in League of Legends' production and/or management.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

type socialLink = {
  iconUrl: string;
  hrefLink: string;
};

function DevCard({
  name,
  title,
  links,
  content,
}: {
  name: string;
  title: string;
  links: socialLink[];
  content?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full text-center text-white place-items-center place-content-center p-1">
      <h2 className="text-xl text-[#9191E0]">{name}</h2>
      <div>{title}</div>
      <div className="text-md">{content}</div>

      <div className="flex flex-row place-content-center gap-2 w-full pt-1">
        {links.map((link, index) => {
          return (
            <a
              key={index}
              className="h-8 aspect-square"
              href={link.hrefLink}
              target="_blank"
              rel="noopener noreferrer">
              <img src={link.iconUrl} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

function GamemodeCard({
  title,
  content,
  imgUrl,
  modeUrl,
}: {
  title: string;
  content: string;
  imgUrl: string;
  modeUrl: string;
}) {
  return (
    <NavLink
      to={modeUrl}
      end
      className="w-full h-full flex flex-col gap-2 bg-black/80 text-white p-4 place-items-center text-center rounded-2xl overflow-clip border-3 border-league-gold
      hover:scale-105 duration-250 transition-all ease-out hover:shadow-xl shadow-league-gold/30">
      <div className="w-11/12 aspect-square rounded-2xl overflow-clip border-2 border-league-gold">
        <img src={imgUrl} />
      </div>
      <h2 className="text-league-gold text-2xl">{title}</h2>
      <p className="whitespace-pre-line text-wrap w-full">{content}</p>
    </NavLink>
  );
}
