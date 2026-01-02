export function initForm(supabase){
    const form = document.getElementById("contactForm");
    const button = document.getElementById("submitBtn");
    const messageBox = document.getElementById("formMessage");

    let toastTimeout;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        messageBox.textContent = "";
        messageBox.className = "toast";

        button.disabled = true;
        button.textContent = "Enviando...";

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const message = document.getElementById("msg").value;
        const honeypot = document.getElementById("company")?.value;


        if (honeypot) {
            button.disabled = false;
            button.textContent = "Enviar mensaje";
            return;
        }

        let leadSaved = false;

        try {
            const { error } = await supabase
            .from("leads")
            .insert([{ name, email, phone, message }]);

            if (error) throw error;
            leadSaved = true;

            const emailRes = await fetch(
            "https://tnbfqakvotmgqbrjhmus.supabase.co/functions/v1/notify-email",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, phone, message })
                }
            );

            if (!emailRes.ok) throw new Error("EMAIL_ERROR");

            const telegramRes = await fetch(
                "https://tnbfqakvotmgqbrjhmus.supabase.co/functions/v1/notify-telegram",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, phone, message })
                }
            );

            if (!telegramRes.ok) throw new Error("TELEGRAM_ERROR");

                showToast("Mensaje enviado correctamente 🙌", "success");
                form.reset();

            } catch (err) {
                console.error(err);

            if (leadSaved) {
                showToast("Se guardó el mensaje, pero no se envió el mensaje", "error");
            } else {
                showToast("Ocurrió un error. Intentá nuevamente.", "error");
            }

            } finally {
                button.disabled = false;
                button.textContent = "Enviar mensaje";
            }
    });

    function showToast(text, type = "success", duration = 3000) {
        clearTimeout(toastTimeout);

        messageBox.textContent = text;
        messageBox.className = `toast show ${type}`;

        toastTimeout = setTimeout(() => {
        messageBox.classList.remove("show");
        }, duration);
    }

}

