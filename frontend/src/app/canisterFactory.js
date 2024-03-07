import { HttpAgent, Actor } from "@dfinity/agent";
// import { idlFactory as marketPlaceIDL } from "../../../declarations/dfinity_js_backend/dfinity_js_backend.did.js";
// import { idlFactory as ledgerIDL } from "../../../declarations/ledger_canister/ledger_canister.did.js";
import { idlFactory as backend} from "@/declarations/backend/backend.did.js";
const CANISTER_ID = "b77ix-eeaaa-aaaaa-qaada-cai";
// const CANISTER_ID = "bd3sg-teaaa-aaaaa-qaaba-cai";

const HOST = "http://localhost:4943";


export async function getBackendCanister() {
    return getCanister(CANISTER_ID, backend);
}

async function getCanister(canisterId, idl) {
    const authClient = window.auth.client;
    const agent = new HttpAgent({
        host: HOST,
        identity: authClient.getIdentity()
    });
    await agent.fetchRootKey(); // this line is needed for the local env only
    return Actor.createActor(idl, {
        agent,
        canisterId,
    });
}