import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import NavBar from "../components/NavBar";
import PageHeader from "../components/PageHeader";
import Textarea from "../components/Textarea";
import styles from "../css/contact.module.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    // Validation basique
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const recipient = "fredericbedia18@gmail.com";
    const subject = `Demande de contact de ${name.trim()}`;
    const body = `Bonjour,

Vous avez reçu un nouveau message depuis votre portfolio :

Nom: ${name.trim()}
Email: ${email.trim()}

Message:
${message.trim()}

Cordialement,
Votre portfolio`;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Essayer d'ouvrir le client email
    try {
      window.location.href = mailtoLink;
    } catch (error) {
      // Fallback si mailto ne fonctionne pas
      alert("Impossible d'ouvrir votre client email. Copiez cette adresse : " + recipient);
    }
  };

  return (
    <div>
      <NavBar />
      <div>
        <PageHeader heading='Conctact us' text='Feel free to ask us anything' />

        <div className={styles.formContainer}>
          <Input
            type='text'
            placeholder='Full Name'
            value={name}
            setValue={setName}
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
          <Button text='Submit' onClick={handleSubmit} />
        </div>
        <div className={styles.infoContainer}>
  
          <p className={styles.info}>The Best Learning Plateforme</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
