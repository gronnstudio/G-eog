/**
 * The seasonal calendar: what to do in the garden and landscape each
 * month, tuned to the Dutch / Western-European climate. Bilingual at
 * the data level ({ en, nl }); tasks link into the knowledge base
 * where a genuinely relevant article exists.
 */

export interface SeasonalTask {
  title: { en: string; nl: string }
  body: { en: string; nl: string }
  domains: string[]
  articleSlug?: string
  articleCategory?: string
}

export interface SeasonalMonth {
  month: number // 1-12
  name: { en: string; nl: string }
  theme: { en: string; nl: string }
  tasks: SeasonalTask[]
}

export const SEASONAL: SeasonalMonth[] = [
  {
    month: 1,
    name: { en: "January", nl: "Januari" },
    theme: { en: "The quiet ledger", nl: "De stille balans" },
    tasks: [
      {
        title: { en: "Plan the coming season on paper", nl: "Plan het komende seizoen op papier" },
        body: {
          en: "Map beds, rotations and new tree positions while the garden sleeps. Design decisions made now prevent compaction and regret later.",
          nl: "Teken bedden, rotaties en nieuwe boomplekken terwijl de tuin slaapt. Ontwerpkeuzes nu voorkomen verdichting en spijt later.",
        },
        domains: ["permaculture"],
        articleSlug: "keyline-design",
        articleCategory: "permaculture",
      },
      {
        title: { en: "Leave the leaves and stems standing", nl: "Laat blad en stengels staan" },
        body: {
          en: "Hollow stems and leaf litter are overwintering shelters for solitary bees and beetles. Tidying now is eviction.",
          nl: "Holle stengels en bladstrooisel zijn overwinteringsplekken voor solitaire bijen en kevers. Nu opruimen is uitzetting.",
        },
        domains: ["animals", "soil"],
      },
      {
        title: { en: "Prune apples and pears on a dry day", nl: "Snoei appels en peren op een droge dag" },
        body: {
          en: "Dormant pruning shapes structure without stressing the tree. Never in frost; never the stone fruit (wait for summer).",
          nl: "Wintersnoei geeft structuur zonder de boom te stressen. Nooit bij vorst; nooit steenfruit (wacht tot de zomer).",
        },
        domains: ["food-forests", "trees"],
      },
      {
        title: { en: "Feed the soil, not the plants", nl: "Voed de bodem, niet de planten" },
        body: {
          en: "Spread compost or wood chips on empty beds. Winter rain pulls the biology down into the profile before spring roots arrive.",
          nl: "Verdeel compost of houtsnippers over lege bedden. Winterregen trekt het bodemleven het profiel in vóór de lentewortels komen.",
        },
        domains: ["soil"],
        articleSlug: "soil-food-web",
        articleCategory: "soil",
      },
    ],
  },
  {
    month: 2,
    name: { en: "February", nl: "Februari" },
    theme: { en: "First stirrings", nl: "Eerste beweging" },
    tasks: [
      {
        title: { en: "Start seeds indoors", nl: "Zaai binnen voor" },
        body: {
          en: "Chillies, tomatoes and early brassicas on a bright windowsill. A head start indoors buys weeks of harvest later.",
          nl: "Pepers, tomaten en vroege koolsoorten op een lichte vensterbank. Binnen voorzaaien levert later weken extra oogst op.",
        },
        domains: ["food-forests"],
      },
      {
        title: { en: "Hang bee hotels and clean nest boxes", nl: "Hang bijenhotels op en maak nestkasten schoon" },
        body: {
          en: "Mason bees fly from March. South-east facing, firm, and near early bloom — willow and crocus are their fuel.",
          nl: "Metselbijen vliegen vanaf maart. Zuidoost gericht, stevig, dicht bij vroege bloei — wilg en krokus zijn hun brandstof.",
        },
        domains: ["animals"],
        articleSlug: "pollinator-networks",
        articleCategory: "animals",
      },
      {
        title: { en: "Plant bare-root trees and hedges", nl: "Plant bomen en hagen met blote wortel" },
        body: {
          en: "The last good month for bare-root planting: the soil is moist, the plant asleep, and roots settle before the spring flush.",
          nl: "De laatste goede maand voor blote wortel: de grond is vochtig, de plant slaapt, en wortels zetten zich vóór de lente-uitloop.",
        },
        domains: ["trees", "food-forests"],
        articleSlug: "miyawaki-mini-forests",
        articleCategory: "urban-ecology",
      },
      {
        title: { en: "Chit potatoes in the light", nl: "Laat pootaardappelen voorkiemen in het licht" },
        body: {
          en: "Egg boxes on a cool bright shelf. Short green sprouts now mean faster establishment in March–April.",
          nl: "Eierdozen op een koele, lichte plank. Korte groene kiemen nu betekenen snellere aanslag in maart–april.",
        },
        domains: ["food-forests"],
      },
    ],
  },
  {
    month: 3,
    name: { en: "March", nl: "Maart" },
    theme: { en: "The ground wakes", nl: "De grond ontwaakt" },
    tasks: [
      {
        title: { en: "Sow hardy crops outside", nl: "Zaai winterharde gewassen buiten" },
        body: {
          en: "Broad beans, peas, spinach, radish — as soon as soil crumbles instead of smears. Cold nights harden strong plants.",
          nl: "Tuinbonen, erwten, spinazie, radijs — zodra grond kruimelt in plaats van smeert. Koude nachten harden sterke planten.",
        },
        domains: ["food-forests", "soil"],
      },
      {
        title: { en: "Stop digging — disturb nothing", nl: "Stop met spitten — verstoor niets" },
        body: {
          en: "Spring digging shreds fungal networks just as they wake. Broadfork if compacted; otherwise mulch and let roots do the tillage.",
          nl: "Spitten in het voorjaar verscheurt schimmelnetwerken net als ze ontwaken. Woelvork bij verdichting; anders mulchen en wortels het werk laten doen.",
        },
        domains: ["soil", "fungi"],
        articleSlug: "mycorrhizal-networks",
        articleCategory: "fungi",
      },
      {
        title: { en: "Make a rain plan before the dry months", nl: "Maak een regenplan vóór de droge maanden" },
        body: {
          en: "Fit water butts, check gutters, shape shallow swales on slopes. March rain stored is July irrigation saved.",
          nl: "Plaats regentonnen, controleer goten, vorm ondiepe swales op hellingen. Maartregen opgeslagen is juli-irrigatie bespaard.",
        },
        domains: ["water"],
        articleSlug: "the-water-cycle",
        articleCategory: "water",
      },
      {
        title: { en: "Leave a wild corner unmown", nl: "Laat een wilde hoek ongemaaid" },
        body: {
          en: "Decide now which patch stays long all season. One unmown corner outperforms ten insect hotels.",
          nl: "Bepaal nu welk stuk het hele seizoen lang blijft. Eén ongemaaide hoek presteert beter dan tien insectenhotels.",
        },
        domains: ["animals", "ecology"],
      },
    ],
  },
  {
    month: 4,
    name: { en: "April", nl: "April" },
    theme: { en: "Green acceleration", nl: "Groene versnelling" },
    tasks: [
      {
        title: { en: "Plant out after hardening off", nl: "Plant uit na afharden" },
        body: {
          en: "A week of daytime outings toughens indoor seedlings before transplanting. Watch for late frost on clear nights.",
          nl: "Een week overdag buiten hardt binnenzaailingen af vóór het uitplanten. Let op late vorst bij heldere nachten.",
        },
        domains: ["food-forests"],
      },
      {
        title: { en: "Mulch everything bare", nl: "Mulch alles wat kaal is" },
        body: {
          en: "Bare soil in April is weeds in May. Grass clippings, chop-and-drop or compost — armour the surface before the flush.",
          nl: "Kale grond in april is onkruid in mei. Grasmaaisel, chop-and-drop of compost — bepantser het oppervlak vóór de uitbarsting.",
        },
        domains: ["soil", "permaculture"],
        articleSlug: "chop-and-drop-mulching",
        articleCategory: "permaculture",
      },
      {
        title: { en: "Sow a native flower strip", nl: "Zaai een inheemse bloemenstrook" },
        body: {
          en: "Native annuals and perennials feed specialist pollinators that ornamental mixes miss. Local seed, thin sowing, no fertiliser.",
          nl: "Inheemse eenjarigen en vaste planten voeden specialistische bestuivers die sierzaadmengsels missen. Lokaal zaad, dun zaaien, geen mest.",
        },
        domains: ["botany", "animals"],
        articleSlug: "the-case-for-native-plants",
        articleCategory: "botany",
      },
      {
        title: { en: "Ponds: top up with rain, never tap", nl: "Vijvers: bijvullen met regen, nooit kraanwater" },
        body: {
          en: "Amphibian eggs and larvae are in the water now. Tap water's nutrients feed algae, not tadpoles.",
          nl: "Amfibie-eieren en larven zitten nu in het water. De voedingsstoffen in kraanwater voeden algen, geen kikkervisjes.",
        },
        domains: ["water", "animals"],
      },
    ],
  },
  {
    month: 5,
    name: { en: "May", nl: "Mei" },
    theme: { en: "No Mow May", nl: "Maai Mei Niet" },
    tasks: [
      {
        title: { en: "Skip the mower this month", nl: "Sla de maaier deze maand over" },
        body: {
          en: "Letting the lawn bloom in May multiplies nectar tenfold. Mow paths through it — intention reads as design, not neglect.",
          nl: "Het gazon laten bloeien in mei vertienvoudigt de nectar. Maai er paden doorheen — intentie oogt als ontwerp, niet als verwaarlozing.",
        },
        domains: ["animals", "ecology"],
      },
      {
        title: { en: "Plant out the frost-tender crops", nl: "Plant de vorstgevoelige gewassen uit" },
        body: {
          en: "After the ice saints (mid-May), tomatoes, squash, beans and corn can go out. Warm soil beats early dates.",
          nl: "Na de ijsheiligen (half mei) kunnen tomaten, pompoen, bonen en maïs naar buiten. Warme grond verslaat vroege data.",
        },
        domains: ["food-forests"],
      },
      {
        title: { en: "Watch the aphids — then wait", nl: "Zie de bladluizen — en wacht" },
        body: {
          en: "Ladybirds and hoverflies arrive two weeks after their prey. Spraying now cancels the predators you were about to be given.",
          nl: "Lieveheersbeestjes en zweefvliegen komen twee weken na hun prooi. Nu spuiten schrapt de roofdieren die je gratis zou krijgen.",
        },
        domains: ["animals", "ecology"],
      },
      {
        title: { en: "Thin direct-sown rows ruthlessly", nl: "Dun direct gezaaide rijen genadeloos uit" },
        body: {
          en: "Crowded seedlings all lose. The thinnings of beets, carrots and lettuce are the first salad of the year.",
          nl: "Zaailingen die elkaar verdringen verliezen allemaal. Het dunsel van biet, wortel en sla is de eerste salade van het jaar.",
        },
        domains: ["food-forests"],
      },
    ],
  },
  {
    month: 6,
    name: { en: "June", nl: "Juni" },
    theme: { en: "Peak light", nl: "Hoogtepunt van licht" },
    tasks: [
      {
        title: { en: "Water deep, not often", nl: "Geef diep water, niet vaak" },
        body: {
          en: "A soaking twice a week grows deep roots; a daily sprinkle grows dependent ones. Morning beats evening for mildew.",
          nl: "Twee keer per week doordrenken kweekt diepe wortels; dagelijks sproeien kweekt afhankelijke. Ochtend verslaat avond tegen meeldauw.",
        },
        domains: ["water"],
      },
      {
        title: { en: "Summer-prune the stone fruit", nl: "Zomersnoei het steenfruit" },
        body: {
          en: "Cherries and plums heal fast in dry June air — winter pruning invites silver leaf and bacterial canker.",
          nl: "Kersen en pruimen helen snel in droge junilucht — wintersnoei nodigt loodglans en bacteriekanker uit.",
        },
        domains: ["trees", "food-forests"],
      },
      {
        title: { en: "Chop-and-drop the spring flush", nl: "Chop-and-drop de voorjaarsgroei" },
        body: {
          en: "Comfrey, nettle and cover crops cut now become mulch and slow-release feed exactly where they fall.",
          nl: "Smeerwortel, brandnetel en groenbemesters die je nu knipt worden mulch en langzame voeding precies waar ze vallen.",
        },
        domains: ["permaculture"],
        articleSlug: "chop-and-drop-mulching",
        articleCategory: "permaculture",
      },
      {
        title: { en: "Log what thrives where", nl: "Noteer wat waar gedijt" },
        body: {
          en: "Midsummer is the honest audit: which guilds work, which corners bake, where water lingers. Notes now steer autumn planting.",
          nl: "Midzomer is de eerlijke audit: welke gilden werken, welke hoeken verbranden, waar water blijft staan. Notities nu sturen de najaarsaanplant.",
        },
        domains: ["permaculture", "ecology"],
      },
    ],
  },
  {
    month: 7,
    name: { en: "July", nl: "Juli" },
    theme: { en: "Heat and harvest", nl: "Hitte en oogst" },
    tasks: [
      {
        title: { en: "Harvest daily to keep plants producing", nl: "Oogst dagelijks om planten productief te houden" },
        body: {
          en: "Beans, courgettes and cucumbers stop flowering the moment fruit ripens fully. Picking is pruning for production.",
          nl: "Bonen, courgettes en komkommers stoppen met bloeien zodra vruchten volledig afrijpen. Plukken is snoeien voor productie.",
        },
        domains: ["food-forests"],
      },
      {
        title: { en: "Shade the pond and top up wildlife water", nl: "Beschaduw de vijver en vul dierendrinkplaatsen bij" },
        body: {
          en: "Floating plants cool the water; a shallow dish with stones saves bees and hedgehogs in a heatwave.",
          nl: "Drijfplanten koelen het water; een ondiepe schaal met stenen redt bijen en egels tijdens een hittegolf.",
        },
        domains: ["water", "animals"],
      },
      {
        title: { en: "Sow the autumn garden now", nl: "Zaai nu de herfsttuin" },
        body: {
          en: "Kale, chicory, fennel, turnips and winter lettuce sown in July fill the hungry gap on the other side of summer.",
          nl: "Boerenkool, witlof, venkel, rapen en wintersla gezaaid in juli vullen het schrale gat aan de andere kant van de zomer.",
        },
        domains: ["food-forests"],
      },
      {
        title: { en: "Let the lawn go golden", nl: "Laat het gazon goud worden" },
        body: {
          en: "Dormant grass is not dead grass. Watering lawns in drought spends drinking water on a plant designed to wait.",
          nl: "Rustend gras is geen dood gras. Gazons sproeien in droogte verspilt drinkwater aan een plant die gebouwd is om te wachten.",
        },
        domains: ["water", "ecology"],
      },
    ],
  },
  {
    month: 8,
    name: { en: "August", nl: "Augustus" },
    theme: { en: "Seeds and surplus", nl: "Zaden en overvloed" },
    tasks: [
      {
        title: { en: "Save seed from your best plants", nl: "Win zaad van je beste planten" },
        body: {
          en: "Dry pods on the plant, label ruthlessly, store cool. Ten minutes now is next year's seed order — adapted to your soil.",
          nl: "Laat peulen aan de plant drogen, etiketteer streng, bewaar koel. Tien minuten nu is de zaadbestelling van volgend jaar — aangepast aan jouw grond.",
        },
        domains: ["botany", "food-forests"],
        articleSlug: "forgotten-vegetables-and-crop-diversity",
        articleCategory: "food-forests",
      },
      {
        title: { en: "Preserve the glut", nl: "Verwerk de overvloed" },
        body: {
          en: "Ferment, dry, freeze. A garden that feeds you in February is one that was busy in August.",
          nl: "Fermenteer, droog, vries in. Een tuin die je in februari voedt, was druk in augustus.",
        },
        domains: ["food-forests"],
      },
      {
        title: { en: "Order bulbs and bare-root stock", nl: "Bestel bollen en blote-wortelplanten" },
        body: {
          en: "The good nurseries sell out by October. Order now for the autumn planting window.",
          nl: "De goede kwekerijen zijn in oktober uitverkocht. Bestel nu voor het najaarsplantseizoen.",
        },
        domains: ["botany", "trees"],
      },
      {
        title: { en: "Leave seedheads for the finches", nl: "Laat zaaddozen staan voor de vinken" },
        body: {
          en: "Teasel, knapweed and evening primrose feed goldfinches into winter. Deadheading ends the show early.",
          nl: "Kaardenbol, knoopkruid en teunisbloem voeden puttertjes tot in de winter. Uitgebloeide bloemen knippen beëindigt de voorstelling te vroeg.",
        },
        domains: ["animals", "botany"],
      },
    ],
  },
  {
    month: 9,
    name: { en: "September", nl: "September" },
    theme: { en: "The turning", nl: "De kentering" },
    tasks: [
      {
        title: { en: "Sow green manures on emptying beds", nl: "Zaai groenbemesters op leegkomende bedden" },
        body: {
          en: "Phacelia, rye and clover hold nutrients winter rain would wash away, and feed the soil food web till spring.",
          nl: "Phacelia, rogge en klaver houden voedingsstoffen vast die winterregen zou uitspoelen, en voeden het bodemvoedselweb tot de lente.",
        },
        domains: ["soil"],
        articleSlug: "soil-food-web",
        articleCategory: "soil",
      },
      {
        title: { en: "Plant the spring bulbs", nl: "Plant de voorjaarsbollen" },
        body: {
          en: "Crocus, snowdrop and native daffodil in grass and under trees — the first nectar of next year goes in the ground now.",
          nl: "Krokus, sneeuwklokje en wilde narcis in gras en onder bomen — de eerste nectar van volgend jaar gaat nu de grond in.",
        },
        domains: ["botany", "animals"],
      },
      {
        title: { en: "Start the compost turn", nl: "Zet de composthoop om" },
        body: {
          en: "One good turn with autumn's first browns sets up a hot heap that finishes before frost.",
          nl: "Eén goede omzetting met het eerste bruine herfstmateriaal geeft een hete hoop die klaar is vóór de vorst.",
        },
        domains: ["soil"],
      },
      {
        title: { en: "Harvest and dry the storage crops", nl: "Oogst en droog de bewaargewassen" },
        body: {
          en: "Onions, squash and potatoes cure in a dry airy week outdoors — skins harden, storage doubles.",
          nl: "Uien, pompoenen en aardappels harden in een droge, luchtige week buiten — schillen verstevigen, bewaartijd verdubbelt.",
        },
        domains: ["food-forests"],
      },
    ],
  },
  {
    month: 10,
    name: { en: "October", nl: "Oktober" },
    theme: { en: "Planting weather", nl: "Plantweer" },
    tasks: [
      {
        title: { en: "Plant trees and shrubs — the best month", nl: "Plant bomen en struiken — de beste maand" },
        body: {
          en: "Warm soil, cool air, months of rain ahead: October roots establish before summer ever tests them.",
          nl: "Warme grond, koele lucht, maanden regen op komst: oktoberwortels vestigen zich voordat de zomer ze ooit test.",
        },
        domains: ["trees", "food-forests"],
        articleSlug: "seven-layer-food-forest",
        articleCategory: "food-forests",
      },
      {
        title: { en: "Rake leaves onto beds, not into bags", nl: "Hark blad op de bedden, niet in zakken" },
        body: {
          en: "Leaf litter is free mulch, worm food and beetle habitat. Bag only what smothers the pond or the lawn paths.",
          nl: "Bladstrooisel is gratis mulch, wormenvoer en keverhabitat. Zak alleen af wat vijver of paden verstikt.",
        },
        domains: ["soil", "animals"],
      },
      {
        title: { en: "Build the winter shelter pile", nl: "Bouw de winterschuilhoop" },
        body: {
          en: "Logs, brash and leaves in a quiet corner: hedgehog quarters, toad cellar, beetle bank — one pile, three tenants.",
          nl: "Stammen, takken en blad in een rustige hoek: egelverblijf, paddenkelder, keverbank — één hoop, drie bewoners.",
        },
        domains: ["animals", "ecology"],
      },
      {
        title: { en: "Plant garlic before the frost", nl: "Plant knoflook vóór de vorst" },
        body: {
          en: "Garlic wants a cold spell to split into cloves. In by early November, harvested with the midsummer sun.",
          nl: "Knoflook wil een koudeperiode om te splitsen in tenen. Vóór begin november erin, geoogst met de midzomerzon.",
        },
        domains: ["food-forests"],
      },
    ],
  },
  {
    month: 11,
    name: { en: "November", nl: "November" },
    theme: { en: "Letting go", nl: "Loslaten" },
    tasks: [
      {
        title: { en: "Stop tidying — the garden is habitat now", nl: "Stop met opruimen — de tuin is nu habitat" },
        body: {
          en: "Standing stems, seedheads and leaf drifts carry the invertebrate year across winter. Spring cleaning belongs in spring.",
          nl: "Staande stengels, zaaddozen en bladhopen dragen het insectenjaar de winter door. Voorjaarsschoonmaak hoort in het voorjaar.",
        },
        domains: ["animals", "ecology"],
        articleSlug: "rewilding",
        articleCategory: "biodiversity",
      },
      {
        title: { en: "Protect the tender perennials", nl: "Bescherm de vorstgevoelige vaste planten" },
        body: {
          en: "A collar of leaves or straw over dahlias, artichokes and young figs — insulation from the soil up.",
          nl: "Een kraag van blad of stro over dahlia's, artisjokken en jonge vijgen — isolatie vanaf de grond.",
        },
        domains: ["botany"],
      },
      {
        title: { en: "Clean and oil the tools", nl: "Maak gereedschap schoon en olie het in" },
        body: {
          en: "Sharp, rust-free tools in spring start in November. Linseed oil on wood, camellia oil on steel.",
          nl: "Scherp, roestvrij gereedschap in de lente begint in november. Lijnolie op hout, camelia-olie op staal.",
        },
        domains: ["permaculture"],
      },
      {
        title: { en: "Feed the birds, skip the bread", nl: "Voer de vogels, sla het brood over" },
        body: {
          en: "Sunflower hearts, fat and unsalted peanuts as natural food runs out. Clean feeders fortnightly — hygiene saves flocks.",
          nl: "Zonnebloempitten, vet en ongezouten pinda's als natuurlijk voedsel opraakt. Maak voederplekken tweewekelijks schoon — hygiëne redt zwermen.",
        },
        domains: ["animals"],
      },
    ],
  },
  {
    month: 12,
    name: { en: "December", nl: "December" },
    theme: { en: "Rest and roots", nl: "Rust en wortels" },
    tasks: [
      {
        title: { en: "Walk the land, touch nothing", nl: "Loop over het land, raak niets aan" },
        body: {
          en: "December shows the bones: sightlines, wet spots, wind tunnels. The best design work of the year is done with cold hands in pockets.",
          nl: "December toont het skelet: zichtlijnen, natte plekken, windtunnels. Het beste ontwerpwerk van het jaar gebeurt met koude handen in de zakken.",
        },
        domains: ["permaculture", "ecology"],
      },
      {
        title: { en: "Read, and feed the inner ecosystem", nl: "Lees, en voed het innerlijke ecosysteem" },
        body: {
          en: "The knowledge graph is evergreen. One article a week through winter is a different gardener by March.",
          nl: "De kennisgraaf is groenblijvend. Eén artikel per week de winter door maakt je in maart een andere tuinier.",
        },
        domains: ["ecology"],
        articleSlug: "ecological-succession",
        articleCategory: "ecology",
      },
      {
        title: { en: "Prune the grapevine before midwinter", nl: "Snoei de druif vóór midwinter" },
        body: {
          en: "Vines pruned after New Year bleed sap for weeks. December cuts seal clean.",
          nl: "Druiven gesnoeid na Nieuwjaar bloeden wekenlang sap. Decemberwonden sluiten schoon.",
        },
        domains: ["food-forests"],
      },
      {
        title: { en: "Check the shelter pile is undisturbed", nl: "Controleer of de schuilhoop onverstoord is" },
        body: {
          en: "No moving, no burning — someone is asleep in there. If a bonfire must happen, rebuild the heap the same day, then light it.",
          nl: "Niet verplaatsen, niet verbranden — er slaapt iemand in. Moet er toch een vuur, herbouw de hoop dezelfde dag en steek hem dan pas aan.",
        },
        domains: ["animals"],
      },
    ],
  },
]
