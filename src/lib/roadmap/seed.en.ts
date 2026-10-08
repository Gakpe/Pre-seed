import type { InvestorBrief, Phase, PhaseCapacity } from "./types";

// Version anglaise des textes de la roadmap, en surcouche du seed français qui
// reste la source partagée avec l'admin Minah. Une entrée absente retombe sur
// le français. Traduit le 03/10/2026 ; à tenir à jour avec seed.ts.

export const META_EN: {
  vision: string;
  experienceParPhase: Record<Phase, string>;
  capacitesParPhase: Record<Phase, PhaseCapacity>;
  defendableParPhase: Record<Phase, string[]>;
  apprentissagesParPhase: Partial<Record<Phase, string>>;
  preuveLibreParPhase: Partial<Record<Phase, string>>;
} = {
  vision: "Agent-native rails for African private debt.",
  experienceParPhase: {
    fondations:
      "Before any interface, the proof: a first techno-financial MVP. An African bond becomes an on-chain asset, held by an institutional custodian and backed by real KYC. The base everything else will plug into.",
    b2c: "An all-in-one platform: the user signs in, completes KYC and invests in a single West African project, end to end. And we find out what this market really asks for.",
    b2b: "The platform turns to professional investors: verified access, questionnaire, online subscription. A qualified-investor experience, with enhanced follow-up at every step.",
    api_v1:
      "The experience becomes seamless for digital players: the platform's main functions are automated through the API or an AI agent. A partner distributes the strategies to its own clients without going through the team.",
    api_v2:
      "Capital moves on its own: fintechs are funded, idle treasury works in T-bills, agents browse and subscribe, everyone tracks their positions in real time.",
    vision:
      "Financing Africa's real economy becomes as liquid as a listed market: principal and yield trade separately, one token opens every strategy, and you can exit before maturity.",
  },
  capacitesParPhase: {
    fondations: { capacite: "Rails, custody and KYC are in place; the first bonds are tokenised.", volume: "First issuances" },
    b2c: { capacite: "Full B2C space with end-to-end subscription, first strategies executed.", volume: "Test MVP, under €100K" },
    b2b: { capacite: "Professional investors subscribe online through the B2B platform.", volume: "€2M to €15M over the period" },
    api_v1: {
      capacite: "Partners and protocols distribute the strategies through the API; admin and Web3 unified.",
      volume: "New strategy of €15M to €20M",
      api: "API v1, the entrance: partners and protocols browse the strategies and subscribe.",
    },
    api_v2: {
      capacite: "The vault lends to fintechs, treasury is placed in T-bills, AI agents subscribe.",
      volume: "Target: above €100M",
      api: "API v2, the exit and automation: direct deployment to fintechs, automatic placement of idle treasury, agent flows through MCP, real-time data for dynamic reports.",
    },
    vision: { capacite: "Liquid positions (PT/YT, secondary market) and a multi-strategy token.", volume: "Road to €1B" },
  },
  defendableParPhase: {
    fondations: [
      "Bonds have been tokenised and settled on-chain since 2025: the infrastructure has already been used, it is not an intention.",
      "Custody is institutional (Fireblocks) and KYC (Sumsub) is part of the base, not a layer added afterwards.",
      "Stellar as the first rail: fees and settlement times compatible with African ticket sizes.",
    ],
    b2c: [
      "The full journey, access, verification, subscription, settlement, ran end to end with real investors.",
      "The team measured what a retail investor costs (small ticket, heavy KYC) and pivoted fast rather than insisting.",
      "The platform is operated by Minah, not outsourced: every step of the journey can be changed without depending on a vendor.",
      "Everything needed to run B2C: sign-in, KYC, signature of a financial instrument, subscription, tracking, and a live Q&A held on the platform.",
      "The on-chain layer is already present in the product, even though it is not yet wired end to end for the final user.",
    ],
    b2b: [
      "Professional investors subscribe online: the same technical base serves tickets a hundred times larger, without a rewrite.",
      "The access gate and the questionnaire make compliance workable at scale, without case-by-case manual handling.",
      "The first partner integration proves that Minah strategies can be distributed by a third party.",
      "Fireblocks custody scales: security follows ticket size, it does not suffer from it.",
    ],
    api_v1: [
      "A single API in front of several rails, Stellar today, Canton Network and Fireblocks: a partner plugs in once and reaches every strategy.",
      "Distribution no longer depends on the team: each connected protocol widens the network without specific development.",
      "Admin and Web3 are unified: what the team sees and what is on-chain are the same thing.",
    ],
    api_v2: [
      "Flows no longer sleep: idle treasury is placed in T-bills and the vault deploys to fintechs, automatically.",
      "Built for agents: a fully documented API and an MCP server, so that Minah's next users are machines too.",
      "Three volume engines, private debt, sovereign debt, crypto liquidity, on the same infrastructure: growing does not multiply systems.",
    ],
    vision: [
      "Beyond €1B, volume comes from institutions, which need liquidity. Minah delivers it as a tech enabler, on-chain: that is where our edge lies.",
      "Fintechs and partners first plug in through a gated API, which then opens up to the free flow of assets.",
      "At that scale, Minah becomes financial infrastructure, beyond creating and distributing strategies. The versatility of its connections makes the difference.",
    ],
  },
  apprentissagesParPhase: {
    b2c: "The full journey holds end to end, but a B2C space does not make a market: tickets are too small and KYC too heavy for retail investors. Hence the B2B pivot.",
    b2b: "Professional investors want an access gate and a contact person before subscribing; online subscription comes after trust, not before.",
  },
  preuveLibreParPhase: {
    fondations: "First subscribers, about €15K",
    b2c: "Under 40 investors, under €100K",
    b2b: "First institutional subscribers",
  },
};

/** Par identifiant d'objectif : titre, capacité débloquée, brief investisseur. */
export const OBJECTIVES_EN: Record<string, { titre: string; capaciteDebloquee: string; brief: InvestorBrief }> = {
  "signature-titre": { titre: "Signing the financial instrument", capaciteDebloquee: "The instrument is signed inside the platform.", brief: { quoi: "Electronic signature of the financial instrument, inside the journey.", pourquoi: "KYC then signature follow each other without a break: the investor never leaves the platform to subscribe.", capacite: "Complete end-to-end subscription." } },
  "site-vitrine": { titre: "minah.io showcase site", capaciteDebloquee: "A first public surface.", brief: { quoi: "Minah's public website.", pourquoi: "The investment thesis becomes readable from the outside, and the first contacts come in.", capacite: "Public presence and inbound contact." } },
  "qa-live": { titre: "Live Q&A on the platform", capaciteDebloquee: "Live questions and answers held inside the product.", brief: { quoi: "Live question-and-answer sessions, inside the platform.", pourquoi: "Trust is built before subscription, and the answer stays attached to the strategy.", capacite: "Direct relationship with investors, without leaving the product." } },
  "suivi-automatise": { titre: "Automated subscription cycle tracking", capaciteDebloquee: "Follow-up at every step, without manual handling.", brief: { quoi: "Automated tracking of every step of a subscription.", pourquoi: "Larger tickets call for close follow-up; automating it keeps up with volume without growing the team.", capacite: "Institutional-grade follow-up, at scale." } },
  "network-builders": { titre: "Network Builders", capaciteDebloquee: "A network of introducers sourcing HNWIs.", brief: { quoi: "An introducer programme, tooled inside the admin space.", pourquoi: "Distribution no longer relies on direct channels alone: a qualified network opens conversations with wealthy investors.", capacite: "HNWI sourcing through the network." } },
  "minah-os": { titre: "Minah OS", capaciteDebloquee: "An internal control tower, readable by agents.", brief: { quoi: "Minah's internal operating system.", pourquoi: "Steering stops being scattered: a single source of truth that agents can read and write.", capacite: "The beginning of the control tower." } },
  "liquidite-permissionnee": { titre: "First on-chain subscribers", capaciteDebloquee: "A first subscription coming from the chain.", brief: { quoi: "Subscription opened to on-chain holders, within a permissioned framework.", pourquoi: "A new source of capital opens without leaving the regulatory framework: the instrument remains a security token.", capacite: "First on-chain subscribers." } },
  "vault-utility-tokens": { titre: "Vault and utility tokens", capaciteDebloquee: "A vault whose shares circulate.", brief: { quoi: "A vault whose shares are utility tokens, on the PT / YT model.", pourquoi: "Exposure becomes transferable without touching the underlying: the first step towards liquidity.", capacite: "Vault shares that circulate." } },
  "rails-onchain-deploiement": { titre: "Deployment through on-chain rails", capaciteDebloquee: "Funds are deployed through the chain.", brief: { quoi: "The on-chain infrastructure used to deploy funds, not only to issue the instrument.", pourquoi: "The path of the money becomes traceable end to end, at costs and speeds a traditional banking rail cannot match.", capacite: "End-to-end traceable deployment." } },
  "pt-yt": { titre: "PT/YT (principal and yield tokens)", capaciteDebloquee: "Positions split into principal and yield.", brief: { quoi: "Splitting a bond into two tokens: the principal and the yield.", pourquoi: "Each component becomes a position in its own right, to be held or sold separately.", capacite: "Liquid positions on principal and yield." } },
  "marche-secondaire": { titre: "Secondary market", capaciteDebloquee: "Exit before maturity.", brief: { quoi: "A secondary market for Minah positions.", pourquoi: "An investor can exit before maturity by selling their position.", capacite: "Liquidity before maturity." } },
  "sandbox-partenaires": { titre: "Partner sandbox", capaciteDebloquee: "Partners test their integration safely.", brief: { quoi: "A sandbox: an isolated test environment open to partners.", pourquoi: "Many players plug into Minah quickly and securely, without touching production.", capacite: "Fast, secure partner integration." } },
  "marque-blanche": { titre: "White-label product", capaciteDebloquee: "Minah plugs into local players, under their brand.", brief: { quoi: "A white-label Minah product, distributed by local players under their own name.", pourquoi: "International and on-chain capital reaches the local economy through players already in place: Minah provides the connection, behind the scenes.", capacite: "Distribution under a local brand." } },
  "agrements-custody": { titre: "On-chain and traditional custody licences", capaciteDebloquee: "Licensed custody, on-chain and traditional.", brief: { quoi: "The licences to operate both on-chain and traditional custody.", pourquoi: "Meet every need, on the liquidity side as on the asset side, with a single player.", capacite: "Licensed custody across both worlds." } },
  "attaque-permanente": { titre: "Continuous attack by the best models", capaciteDebloquee: "Security put to the test continuously.", brief: { quoi: "A continuous attack on the platform by the best AI models of the moment.", pourquoi: "Every new model is put to the test on our infrastructure: any vulnerability found is patched right away.", capacite: "Patches as soon as a vulnerability appears." } },
  "token-multi-strategies": { titre: "Multi-strategy token", capaciteDebloquee: "Diversified exposure in a single token.", brief: { quoi: "A token that aggregates several Minah strategies.", pourquoi: "A single position for diversified exposure to African debt.", capacite: "Diversification in one token." } },
  "espace-b2c": { titre: "B2C space and end-to-end subscription", capaciteDebloquee: "End-to-end subscription.", brief: { quoi: "The first version of the investor space, with end-to-end subscription.", pourquoi: "The full journey, access, verification, subscription, settlement, was executed on first strategies.", capacite: "End-to-end subscription, first strategies executed." } },
  "plateforme-minah": { titre: "minah.io B2B platform", capaciteDebloquee: "Professional investors subscribe online.", brief: { quoi: "The minah.io B2B platform, in production since late September 2026.", pourquoi: "Professional investors access the strategies, complete their KYC and subscribe online.", capacite: "Online subscription to tokenised bonds." } },
  "integration-sereel": { titre: "Sereel integration", capaciteDebloquee: "Distribution through the API.", brief: { quoi: "First partner protocol connected to the Minah API.", pourquoi: "Minah strategies become distributable by third-party platforms, without manual intervention.", capacite: "Distribution through the API.", partenaire: "Sereel" } },
  "protocoles-suivants": { titre: "Realiz, Etherfuse, Untangled", capaciteDebloquee: "Several protocols distribute Minah strategies.", brief: { quoi: "The next partner protocols, connected on the same model as the first.", pourquoi: "Each new protocol widens distribution without specific development.", capacite: "Several distribution channels through a single API." } },
  "environnement-web-strategie": { titre: "Web environment per strategy", capaciteDebloquee: "Dynamic reports per strategy.", brief: { quoi: "A dedicated web environment for each strategy, with dynamic reports.", pourquoi: "The investor follows their strategy in real time rather than through periodic reports.", capacite: "Dynamic reports per strategy." } },
  "tbills-tokenises": { titre: "Access to tokenised T-bills", capaciteDebloquee: "Idle treasury is placed in T-bills.", brief: { quoi: "Access to tokenised treasury bills, through a specialised partner.", pourquoi: "Idle treasury works instead of sleeping, and a sovereign debt engine opens.", capacite: "Automatic placement of idle treasury." } },
  "vault-fintechs": { titre: "Crypto vault connected to fintechs", capaciteDebloquee: "The vault lends to fintechs.", brief: { quoi: "A vault in which crypto players invest, and which lends directly to fintechs.", pourquoi: "Crypto liquidity finances Africa's real economy, without an intermediary.", capacite: "Direct deployment to fintechs." } },
  "agents-ia": { titre: "AI agents", capaciteDebloquee: "An AI agent browses, then subscribes.", brief: { quoi: "AI agents become fully-fledged Minah users.", pourquoi: "An agent can look up an African bond, present it to its user, then subscribe.", capacite: "Subscription by an AI agent." } },
  "api-v1": { titre: "API v1, the entrance", capaciteDebloquee: "Partners browse the strategies and subscribe through the API.", brief: { quoi: "Minah API v1: the entrance to the strategies.", pourquoi: "Partners and protocols browse the strategies and subscribe through the same door, with differentiated access.", capacite: "Distribution through a single API." } },
  "multi-providers-web3": { titre: "Multi-provider web3", capaciteDebloquee: "Strategies no longer depend on a single chain.", brief: { quoi: "Several web3 infrastructures behind the same API.", pourquoi: "Minah is not captive to one rail: each strategy can rely on the most suitable chain.", capacite: "Independence from a single rail." } },
  "api-v2": { titre: "API v2, the exit and automation", capaciteDebloquee: "Money goes out and is placed automatically.", brief: { quoi: "Minah API v2: the exit and automation.", pourquoi: "Direct deployment to fintechs, automatic placement of treasury, agent flows and real-time data.", capacite: "Automation of outbound flows." } },
  "documentation-publique": { titre: "Public documentation", capaciteDebloquee: "A partner or an agent integrates without hand-holding.", brief: { quoi: "The public documentation of the Minah API.", pourquoi: "A developer or an agent can integrate on their own, without going through the team.", capacite: "Self-serve integration." } },
  "serveur-mcp": { titre: "MCP server", capaciteDebloquee: "Agents access Minah natively.", brief: { quoi: "An MCP server, the standard through which AI agents use tools.", pourquoi: "Agents need no specific integration to browse and, in time, subscribe.", capacite: "Native access for agents." } },
  "kyc-sumsub": { titre: "Sumsub KYC", capaciteDebloquee: "Every investor is verified before subscribing.", brief: { quoi: "Investor identity verification, operated with Sumsub.", pourquoi: "No subscription without a verified identity: compliance is part of the journey.", capacite: "Verified investors.", partenaire: "Sumsub" } },
  "admin-rbac": { titre: "Internal admin space", capaciteDebloquee: "The team runs the platform with controlled access.", brief: { quoi: "The administration space: managing the team, internal flows and access.", pourquoi: "Internal flows are steered in one place, and every sensitive action is done by the right person.", capacite: "Team and flow management by the internal team." } },
  "web3-admin": { titre: "Web3 space integrated into the admin", capaciteDebloquee: "On-chain activity is steered from the admin.", brief: { quoi: "On-chain activity, cross-chain included, visible and steerable from the administration space.", pourquoi: "Issuance, custody and settlement are tracked in the same place as investors and strategies.", capacite: "Admin and Web3 unified." } },
  "durcissement-securite": { titre: "Security and pentests", capaciteDebloquee: "An open and hardened platform.", brief: { quoi: "A programme to strengthen the platform's security.", pourquoi: "Opening up to partners and agents comes with security verified by third parties.", capacite: "An open and hardened platform." } },
  "stellar-soroban": { titre: "Stellar Soroban", capaciteDebloquee: "Bonds exist as tokens.", brief: { quoi: "The bond tokenisation contracts, on Stellar.", pourquoi: "Every subscribed bond exists as a token, traceable and transferable.", capacite: "Tokenised bonds.", partenaire: "Stellar" } },
  "starknet": { titre: "Starknet", capaciteDebloquee: "A second rail available.", brief: { quoi: "A second blockchain rail for Minah strategies.", pourquoi: "Minah picks the most suitable rail for each strategy.", capacite: "Rail chosen per strategy." } },
  "fireblocks": { titre: "Fireblocks custody and KYT", capaciteDebloquee: "Institutional custody of assets.", brief: { quoi: "Asset custody and transaction screening, operated with Fireblocks.", pourquoi: "Assets are held by an institutional infrastructure, with flow controls.", capacite: "Institutional custody.", partenaire: "Fireblocks" } },
  "canton-network": { titre: "Canton Network", capaciteDebloquee: "One more institutional rail.", brief: { quoi: "An additional institutional rail connected to the Minah API.", pourquoi: "Strategies can rely on a network designed for financial institutions.", capacite: "One more institutional rail." } },
  "cross-chain-stellar": { titre: "Cross-chain via Stellar", capaciteDebloquee: "The rails talk to each other.", brief: { quoi: "A bridge between the rails, with Stellar as the pivot.", pourquoi: "A position is no longer locked on the chain where it was issued.", capacite: "Interoperability between rails." } },
};
