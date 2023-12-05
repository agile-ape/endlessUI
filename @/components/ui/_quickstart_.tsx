import Image from 'next/image'
import Link from 'next/link'
import { Button } from './button'
import Title from './Title'
import Logo from './Logo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

function Quickstart() {
  return (
    <div className="pb-16">
      <div className="text-center">
        {/* need to remove */}
        <Title stageType={'night'} />
        <div
          className="h-10 rounded-md text-center
                px-2 py-0 text-[24px] font-headline
                text-zinc-300 capitalized"
        >
          how to play
        </div>
      </div>
      <Accordion type="multiple">
        {/* OVERALL */}
        {/* <AccordionItem value="item-1">
          <div className="flex flex-col md:w-[700px] mx-auto w-[90%]">
            <AccordionTrigger>
              <div className="flex gap-2 justify-center items-center">
                <Image
                  priority
                  src={`/indicator/startIndicator.svg`}
                  height={300}
                  width={100}
                  className="place-self-center mb-2"
                  alt={`startIndicator`}
                />
                <div
                  className="h-10 rounded-md text-center
                px-2 py-0 text-[24px] font-headline
                text-zinc-300 capitalized"
                >
                  how to play
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex container-last rounded-xl px-4 py-4 flex-col mx-auto md:w-[700px] w-[90%] justify-center items-center gap-2">
                <Image
                  priority
                  src="/explainer/overall.svg"
                  className=""
                  height={400}
                  width={400}
                  alt="how last man game works"
                />

                <div className="container-last rounded-xl px-4 py-4">
                  <span className="capitalize text-xl">Outlast your competition</span>
                  <ul className="list-disc ml-5 text-lg">
                    <li className="mb-2">You receive $LAST tokens when you attack other players</li>
                    <li className="mb-2">
                      You get the value of players above you if they get killed
                    </li>
                    <li className="mb-2">You can choose to take a break at the Safehouse</li>
                    <li className="mb-2">
                      You get more of the pot the longer you stay in the game - Last Man gets most
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem> */}

        {/* START */}
        <AccordionItem value="item-2">
          <div className="flex flex-col md:w-[700px] mx-auto w-[90%]">
            <AccordionTrigger>
              <div className="flex gap-2 justify-center items-center">
                <Image
                  priority
                  src={`/indicator/startIndicator.svg`}
                  height={300}
                  width={100}
                  // fill={true}
                  // sizes="max-width:150px"
                  className="place-self-center mb-2"
                  // layout="fixed"
                  alt={`startIndicator`}
                />
                <div
                  className="h-10 rounded-md text-center
                px-2 py-0 text-[24px] font-headline
                text-zinc-300 capitalized"
                >
                  It pays to join early
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex container-last rounded-xl px-4 py-4 flex-col mx-auto md:w-[700px] w-[90%] gap-2">
                <Image
                  priority
                  src="/explainer/pricing.svg"
                  className="place-self-center"
                  height={400}
                  width={400}
                  alt="how pricing is done"
                />
                <div className="container-last rounded-xl px-4 py-4">
                  {/* <span className="capitalize text-xl">It pays to join early</span> */}
                  <ul className="list-disc ml-5 text-lg">
                    <li className="mb-2">Players pay an entry fee to join the game</li>
                    <li className="mb-2">
                      The entry fee increases in a laddered manner as more players join
                    </li>
                    <li className="mb-2">
                      Join with a buddy - Both of you receive more $LAST when attacking players
                    </li>
                    <li className="mb-2">
                      30% of fee is kept on player ticket / 60% goes to a pot / 10% goes to team
                    </li>
                  </ul>
                </div>

                {/* <br /> */}

                <Image
                  priority
                  src="/explainer/ticket.svg"
                  className="place-self-center"
                  height={500}
                  width={500}
                  alt="how ticket looks like"
                />

                <div className="container-last rounded-xl px-4 py-4">
                  {/* <span className="capitalize text-xl">Ticket = Game status</span> */}
                  <ul className="list-disc ml-5 text-lg">
                    <li className="mb-2">Your game status is represented by a play ticket</li>
                    <li className="mb-2">Pepe changes depending on your status</li>
                    <li className="mb-2">Hover on each player ticket to see their stats</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* DAY */}
        <AccordionItem value="item-3">
          <div className="flex flex-col md:w-[700px] mx-auto w-[90%]">
            <AccordionTrigger>
              <div className="flex gap-2 justify-center items-center">
                <Image
                  priority
                  src={`/indicator/dayIndicator.svg`}
                  height={300}
                  width={100}
                  // fill={true}
                  // sizes="max-width:150px"
                  className="place-self-center mb-2"
                  // layout="fixed"
                  alt={`startIndicator`}
                />
                <div
                  className="h-10 rounded-md text-center
                px-2 py-0 text-[24px] font-headline
                text-zinc-300 capitalized"
                >
                  submit keyword in the day
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex container-last rounded-xl px-4 py-4 flex-col mx-auto md:w-[700px] w-[90%] gap-2">
                <Image
                  priority
                  src="/explainer/day.svg"
                  className="place-self-center"
                  height={200}
                  width={200}
                  alt="what to do in the day"
                />

                <div className="container-last rounded-xl px-4 py-4">
                  {/* <span className="capitalize text-xl">In the DAY, players submit the keyword</span> */}
                  <ul className="list-disc ml-5 text-lg">
                    <li className="mb-2">
                      Players solve a captcha to reveal the keyword, which they then submit with
                    </li>
                    <li className="mb-2">The keyword is random and changes every day</li>
                    <li className="mb-2">Players can exit the game anytime during the DAY</li>
                    <li className="mb-2">
                      Players claim a % of pot when they exit. The longer they last, they more they
                      get
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* NIGHT */}
        <AccordionItem value="item-4">
          <div className="flex flex-col md:w-[700px] mx-auto w-[90%]">
            <AccordionTrigger>
              <div className="flex gap-2 justify-center items-center">
                <Image
                  priority
                  src={`/indicator/nightIndicator.svg`}
                  height={300}
                  width={100}
                  // fill={true}
                  // sizes="max-width:150px"
                  className="place-self-center mb-2"
                  // layout="fixed"
                  alt={`startIndicator`}
                />
                <div
                  className="h-10 rounded-md text-center
                px-2 py-0 text-[24px] font-headline
                text-zinc-300 capitalized"
                >
                  attack others in the night
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex container-last rounded-xl px-4 py-4 flex-col mx-auto md:w-[700px] w-[90%] gap-2">
                <Image
                  priority
                  src="/explainer/night.svg"
                  className="place-self-center"
                  height={300}
                  width={300}
                  alt="what to do in the night"
                />

                <div className="container-last rounded-xl px-4 py-4">
                  {/* <span className="capitalize text-xl">
                    In the NIGHT, players attack one another
                  </span> */}
                  <ul className="list-disc ml-5 text-lg">
                    <li className="mb-2">
                      Players get 3 attacks per round (when they submit a keyword)
                    </li>
                    <li className="mb-2">
                      Players are safe from attacks if they submitted the keyword. If not, they are
                      killed
                    </li>
                    <li className="mb-2">
                      ** IMPORTANT: When killed, the killed player passes all his value to the
                      player before him - if Player #4 is killed, his entire value goes to Player #3
                      **
                    </li>
                    <li className="mb-2">
                      Killed players can still claim from the pot when they exit the game
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* STAGES */}
        <AccordionItem value="item-5">
          <div className="flex flex-col md:w-[700px] mx-auto w-[90%]">
            <AccordionTrigger>
              <div className="flex gap-2 justify-center items-center">
                <Image
                  priority
                  src={`/faces/inspect.png`}
                  height={300}
                  width={100}
                  // fill={true}
                  // sizes="max-width:150px"
                  className="place-self-center mb-2"
                  // layout="fixed"
                  alt={`startIndicator`}
                />
                <div
                  className="h-10 rounded-md text-center
                px-2 py-0 text-[24px] font-headline
                text-zinc-300 capitalized"
                >
                  the game has 3 stages
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex container-last rounded-xl px-4 py-4 flex-col mx-auto md:w-[700px] w-[90%] gap-2">
                <Image
                  priority
                  src="/explainer/stages.svg"
                  className="place-self-center"
                  height={400}
                  width={600}
                  alt="how pricing is done"
                />

                <div className="container-last rounded-xl px-4 py-4">
                  {/* <span className="capitalize text-xl">The game goes through 3 stages:</span> */}
                  <ul className="list-disc ml-5 text-lg">
                    <li className="mb-2">1 round = 1 DAY/NIGHT cycle</li>
                    <li className="mb-2">
                      <span className="underline tracking-wider">Stage 1:</span> Round time is
                      halved every 4 rounds. Players receive $LAST tokens with every attack made
                    </li>
                    <li className="mb-2">
                      <span className="underline tracking-wider">Stage 2:</span> Round time is no
                      longer halved. No more $LAST is given out. Players get to vote to split pot
                    </li>
                    <li className="mb-2">
                      <span className="underline tracking-wider">Stage 3:</span> Same as Stage 2,
                      but now, a portion of the pot is drained every round
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* SAFEHOUSE */}
        <AccordionItem value="item-6">
          <div className="flex flex-col md:w-[700px] mx-auto w-[90%]">
            <AccordionTrigger>
              <div className="flex gap-2 justify-center items-center">
                <Image
                  priority
                  src={`/faces/warm.png`}
                  height={300}
                  width={100}
                  // fill={true}
                  // sizes="max-width:150px"
                  className="place-self-center mb-2"
                  // layout="fixed"
                  alt={`startIndicator`}
                />
                <div
                  className="h-10 rounded-md text-center
                px-2 py-0 text-[24px] font-headline
                text-zinc-300 capitalized"
                >
                  take a break in the safehouse
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex container-last rounded-xl px-4 py-4 flex-col mx-auto md:w-[700px] w-[90%] gap-2">
                <Image
                  priority
                  src="/explainer/safehouse.svg"
                  className="place-self-center"
                  height={400}
                  width={600}
                  alt="how pricing is done"
                />

                <div className="container-last rounded-xl px-4 py-4">
                  {/* <span className="capitalize text-xl">Take a break in the Safehouse</span> */}
                  <ul className="list-disc ml-5 text-lg">
                    {/* <li className="mb-2">
                      Players can choose to take a break by checking into the Safehouse (only in the
                      DAY)
                    </li> */}
                    <li className="mb-2">
                      Players pay $LAST tokens as payment to check into Safehouse
                    </li>
                    <li className="mb-2">
                      In Safehouse, players have immunity from getting killed, but have limited
                      actions
                    </li>
                    <li className="mb-2">
                      Players have to check out BY the DAY of the check out round
                    </li>
                    <li className="mb-2">
                      However, players can check out anytime, or even overstay. But, other players
                      can kick out and kill players that overstayed during the NIGHT
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* GAME ENDS */}
        <AccordionItem value="item-7">
          <div className="flex flex-col md:w-[700px] mx-auto w-[90%]">
            <AccordionTrigger>
              <div className="flex gap-2 justify-center items-center">
                <Image
                  priority
                  src={`/faces/muscle.png`}
                  height={300}
                  width={100}
                  // fill={true}
                  // sizes="max-width:150px"
                  className="place-self-center mb-2"
                  // layout="fixed"
                  alt={`startIndicator`}
                />
                <div
                  className="h-10 rounded-md text-center
                px-2 py-0 text-[24px] font-headline
                text-zinc-300 capitalized"
                >
                  game ends in 3 ways
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex container-last rounded-xl px-4 py-4 flex-col mx-auto md:w-[700px] w-[90%] gap-2">
                <Image
                  priority
                  src="/explainer/gameends.svg"
                  className="place-self-center"
                  height={400}
                  width={600}
                  alt="how pricing is done"
                />

                <div className="container-last rounded-xl px-4 py-4">
                  {/* <span className="capitalize text-xl">Game ends in 3 scenarios:</span> */}
                  <ul className="list-disc ml-5 text-lg">
                    <li className="mb-2">
                      <span className="underline">LAST MAN FOUND</span> All but 1 player is killed
                      or gives up (exit while alive). Last Man gets most of the pot
                    </li>
                    <li className="mb-2">
                      <span className="underline">PEACE FOUND</span> Players reach consensus to
                      split pot (votes exceed threshold). Pot is split evenly among remaining
                      players
                    </li>
                    <li className="mb-2">
                      <span className="underline">POT DRAINED</span> Players play till the end with
                      no consensus to split pot, draining the pot till nothing is left
                    </li>
                    <li className="mb-2">
                      Once game ends, players have some time to exit and claim their pot reward,
                      before all remaining funds are withdrawn out to next game pot
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Quickstart
