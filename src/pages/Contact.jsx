import { useState } from "react";
import { push, ref, serverTimestamp } from "firebase/database";
import { db } from "../firebase";
import Button from "../components/Button";
import Input from "../components/Input";
import NavBar from "../components/NavBar";
import PageHeader from "../components/PageHeader";
import Textarea from "../components/Textarea";
import styles from "../css/contact.module.css";

const SUBMIT_TIMEOUT_MS = 12000;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function withTimeout(promise, ms) {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Prevent digits and spaces in the name: keep letters only (unicode aware)
  const handleNameChange = (value) => {
    const sanitized = value.replace(/[^\p{L}]/gu, "");
    setName(sanitized);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("Veuillez remplir tous les champs.");
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
      setStatus("Le nom doit contenir entre 2 et 80 caracteres.");
      return;
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("Veuillez entrer une adresse email valide.");
      return;
    }

    if (message.trim().length < 3|| message.trim().length > 1000) {
      setStatus("Le message doit contenir entre 3 et 1000 caracteres.");
      return;
    }

    setLoading(true);
    setStatus("Envoi du message...");

    try {
      await withTimeout(
        push(ref(db, "contacts"), {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          createdAt: serverTimestamp(),
          createdAtText: new Date().toISOString(),
        }),
        SUBMIT_TIMEOUT_MS,
      );

      setStatus("Message envoye avec succes !");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Erreur Realtime Database :", error);
      setStatus(
        error.message === "timeout"
          ? "L'envoi prend trop de temps. Verifiez votre connexion puis reessayez."
          : `Impossible d'envoyer le message (${error.code || "erreur inconnue"}): ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div>
        <PageHeader heading='Contact us' text='Feel free to ask us anything' />

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <Input
            type='text'
            placeholder='Full Name'
            value={name}
            setValue={handleNameChange}
          />
          <Input
            type='email'
            placeholder='Email'
            value={email}
            setValue={setEmail}
          />
          <Textarea
            value={message}
            setValue={setMessage}
            placeholder='Message'
          />
          <Button
            text={loading ? "Envoi..." : "Submit"}
            type='submit'
            disabled={loading}
          />
          {status && <p className={styles.statusMessage}>{status}</p>}
        </form>

        <div className={styles.infoContainer}>
          
        </div>
      </div>
    </div>
  );
}

export default Contact;
