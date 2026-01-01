(() => {

    const SUPABASE_URL = "https://tnbfqakvotmgqbrjhmus.supabase.co";
    const SUPABASE_KEY = "sb_publishable_Db5fiANKUMFWJIA3AhH5bQ_PgXZylG6";

    const supabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const form = document.getElementById("contactForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const message = document.getElementById("msg").value;

        const { error } = await supabase
            .from("leads")
            .insert([
            {
                name,
                email,
                phone,
                message
            }
            ]);
        if (error) {
            console.error("Error enviando formulario:", error);
            alert("Ocurrió un error. Intentá nuevamente.");
            return;
        }

        const res = await fetch(
            "https://tnbfqakvotmgqbrjhmus.supabase.co/functions/v1/notify-email",
            {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                message
            })
            }
        );
        const result = await res.json();
        console.log("Edge response:", res.status, result);

        if (!res.ok) {
            console.error("Error enviando mail");
            alert("El mensaje se guardó, pero no se envió el mail");
            return;
        }

        alert("Mensaje enviado correctamente 🙌");
        form.reset();

        
    });
    

    })();