import { initCatalog } from "./cards.js";
import {initForm} from "./contact_form.js";
import { initNav } from "./nav.js";

const SUPABASE_URL = "https://tnbfqakvotmgqbrjhmus.supabase.co";
const SUPABASE_KEY = "sb_publishable_Db5fiANKUMFWJIA3AhH5bQ_PgXZylG6";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

initNav();
initCatalog(supabase);
initForm(supabase);
