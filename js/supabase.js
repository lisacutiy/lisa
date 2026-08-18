/* =========================================
   SUPABASE CONFIGURATION
========================================= */
const SUPABASE_URL =
    "https://pcgbawvysswzsngyuxjp.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_sph8I1jVX3LdVjoLj_06gA__Wd64bVX";


/* =========================================
   CHECK SUPABASE LIBRARY
========================================= */

if (!window.supabase) {

    throw new Error(
        "Supabase JavaScript library was not loaded."
    );

}


/* =========================================
   CREATE SUPABASE CLIENT
========================================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


console.log(
    "Supabase client initialized successfully."
);
