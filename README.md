# React - Bonnes Pratiques Exhaustives

Guide complet des bonnes pratiques React, applicable a tout projet (petit ou complexe).
Base sur l'experience du portfolio-project et du gmail-clone-project.

---

## Table des matieres

1. [Structure du projet](#1-structure-du-projet)
2. [Composants](#2-composants)
3. [Props](#3-props)
4. [State (useState)](#4-state-usestate)
5. [Effets (useEffect)](#5-effets-useeffect)
6. [Gestion d'etat globale](#6-gestion-detat-globale)
7. [Routing](#7-routing)
8. [Formulaires](#8-formulaires)
9. [Style (CSS Modules, BEM, etc.)](#9-style)
10. [Performance](#10-performance)
11. [Erreurs courantes a eviter](#11-erreurs-courantes-a-eviter)
12. [Conventions de nommage](#12-conventions-de-nommage)
13. [Patterns avances](#13-patterns-avances)

---

## 1. Structure du projet

### Petit projet (portfolio)

```
src/
  components/    # Composants reutilisables (Button, Card, Input...)
  pages/         # Pages/vues (Home, Contact, Team...)
  css/           # Fichiers de style (modules CSS)
  images/        # Assets statiques
  main.jsx       # Point d'entree
```

### Projet complexe (gmail-clone et au-dela)

```
src/
  components/
    Header/
      Header.jsx
      Header.css
      Header.test.jsx
    EmailRow/
      EmailRow.jsx
      EmailRow.css
  pages/
  store/           # State global (Redux, Zustand, Context)
    features/
      userSlice.js
      mailSlice.js
    store.js
  hooks/           # Custom hooks
  utils/           # Fonctions utilitaires
  services/        # Appels API / Firebase
  constants/       # Constantes et config
  main.jsx
```

**Regle** : Quand un composant a son propre CSS + test, regroupe-les dans un dossier portant le nom du composant.

---

## 2. Composants

### Composants "Dumb" (presentationnels)

Ils recoivent des props et affichent du JSX. Aucune logique metier.

```jsx
// BON - Composant dumb, reutilisable
function Button({ text, onClick, outline }) {
  return (
    <button
      onClick={onClick}
      className={outline ? styles.btnOutline : styles.btnFilled}
    >
      {text}
    </button>
  );
}
```

```jsx
// BON - Comme SidebarOption dans gmail-clone
function SidebarOption({ Icon, title, number, selected }) {
  return (
    <div className={`sidebarOption ${selected && "sidebarOption--active"}`}>
      <Icon />
      <h3>{title}</h3>
      <p>{number}</p>
    </div>
  );
}
```

### Composants "Smart" (conteneurs)

Ils gerent la logique, le state et passent les donnees aux composants dumb.

```jsx
// BON - Le parent gere le state et la logique
function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // logique d'envoi
  };

  return (
    <div>
      <Input value={name} setValue={setName} placeholder="Nom" />
      <Input value={email} setValue={setEmail} placeholder="Email" />
      <Button text="Envoyer" onClick={handleSubmit} />
    </div>
  );
}
```

### Un composant = une responsabilite

```jsx
// MAUVAIS - Fait trop de choses
function UserCard({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  // + fetch API + formulaire + affichage + validation...
}

// BON - Separe en composants dedies
function UserCard({ user, onEdit }) { /* affichage */ }
function UserEditForm({ user, onSave }) { /* formulaire */ }
```

---

## 3. Props

### TOUJOURS destructurer les props

```jsx
// MAUVAIS - props en objet, illisible
function Card(props) {
  return <h1>{props.title}</h1>;
}

// BON - destructuration claire
function Card({ title, description, image }) {
  return <h1>{title}</h1>;
}
```

### CRITIQUE : ne jamais oublier les accolades

```jsx
// BUG - Les params sont positionnels, pas des props !
function Textarea(placeholder, value, setValue) { ... }

// CORRECT - Destructuration d'objet
function Textarea({ placeholder, value, setValue }) { ... }
```

Sans `{}`, le premier parametre recoit l'objet props entier,
le deuxieme et troisieme sont `undefined`. C'est un bug silencieux.

### Props par defaut

```jsx
// Avec valeur par defaut dans la destructuration
function Button({ text, onClick, outline = false, size = "md" }) {
  return <button className={outline ? styles.outline : styles.filled}>{text}</button>;
}
```

### Passer des composants JSX en props

```jsx
// BON - Pattern utilise dans les deux projets
// Portfolio : SocialIcon recoit une icone en JSX
<SocialIcon icon={<FaInstagram />} link="https://instagram.com" />

// Gmail-clone : Section recoit un composant Icon
<Section Icon={AllInboxIcon} title="Primary" color="red" />

// Difference : passer un <Composant /> (JSX) vs passer Composant (reference)
// Les deux sont valides, ca depend de l'usage :
//   - JSX (<FaInstagram />) : quand tu veux juste afficher l'icone
//   - Reference (AllInboxIcon) : quand tu veux l'appeler toi-meme <Icon />
```

### Verifier la coherence des noms de props

```jsx
// MAUVAIS - Les liens sont inverses !
<SocialIcon icon={youtubeIcon} link={twitterLink} />
<SocialIcon icon={twitterIcon} link={youtubeLink} />

// BON - Chaque icone a son propre lien
<SocialIcon icon={youtubeIcon} link={youtubeLink} />
<SocialIcon icon={twitterIcon} link={twitterLink} />
```

### Props booleennes

```jsx
// MAUVAIS - String vide est falsy, comportement inattendu
<Button outline="" />
<Button outline="true" />  // C'est une string, pas un boolean !

// BON
<Button outline />          // equivalent a outline={true}
<Button outline={true} />
<Button outline={false} />
// Ou ne pas passer la prop du tout (= undefined = falsy)
<Button text="Submit" />
```

---

## 4. State (useState)

### Quand utiliser useState

- Donnees de formulaire (inputs, textarea)
- Toggle UI (modal ouverte/fermee, menu actif)
- Donnees temporaires locales a un composant

```jsx
// BON - State local pour un formulaire
function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <Input value={name} setValue={setName} />
      <Input value={email} setValue={setEmail} />
    </>
  );
}
```

### State lifting (remonter le state)

Quand deux composants enfants doivent partager un state,
remonte-le dans le parent commun.

```jsx
// Le parent possede le state
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Display count={count} />
      <Controls setCount={setCount} />
    </>
  );
}

// Les enfants recoivent en props
function Display({ count }) {
  return <p>{count}</p>;
}

function Controls({ setCount }) {
  return <button onClick={() => setCount(prev => prev + 1)}>+1</button>;
}
```

### Mettre a jour le state avec la valeur precedente

```jsx
// MAUVAIS - Peut rater des mises a jour en batch
setCount(count + 1);

// BON - Utilise la forme fonctionnelle
setCount(prev => prev + 1);

// Pareil pour les objets
setUser(prev => ({ ...prev, name: "Emmanuel" }));

// Pareil pour les tableaux
setItems(prev => [...prev, newItem]);            // ajouter
setItems(prev => prev.filter(i => i.id !== id)); // supprimer
```

### Ne jamais muter le state directement

```jsx
// MAUVAIS - Mutation directe, React ne re-render pas
const [items, setItems] = useState([]);
items.push(newItem);  // NON !

// BON - Toujours creer une nouvelle reference
setItems([...items, newItem]);
setItems(prev => [...prev, newItem]);
```

---

## 5. Effets (useEffect)

### Syntaxe et tableau de dependances

```jsx
// S'execute a chaque render (rarement voulu)
useEffect(() => { ... });

// S'execute UNE seule fois au montage
useEffect(() => { ... }, []);

// S'execute quand userId change
useEffect(() => { ... }, [userId]);
```

### Cleanup (nettoyage)

```jsx
// BON - Nettoyer les abonnements, timers, listeners
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) dispatch(login(user));
    else dispatch(logout());
  });

  return () => unsubscribe(); // Cleanup au demontage
}, []);
```

### Ce qu'il ne faut PAS mettre dans useEffect

```jsx
// MAUVAIS - Calcul derive dans useEffect
useEffect(() => {
  setFullName(firstName + " " + lastName);
}, [firstName, lastName]);

// BON - Calcul derive directement dans le render
const fullName = firstName + " " + lastName;

// MAUVAIS - Transformer des donnees dans useEffect
useEffect(() => {
  setFilteredItems(items.filter(i => i.active));
}, [items]);

// BON - Calculer pendant le render
const filteredItems = items.filter(i => i.active);
```

---

## 6. Gestion d'etat globale

### Quand utiliser quoi

| Situation | Solution |
|---|---|
| State local a un composant | `useState` |
| State partage entre parent/enfant | State lifting + props |
| State partage entre composants eloignes (theme, langue) | `useContext` |
| State complexe avec beaucoup d'actions (app type gmail) | Redux / Zustand |

### useContext (projets moyens)

```jsx
// 1. Creer le contexte
const ThemeContext = createContext();

// 2. Fournir la valeur
function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Home />
    </ThemeContext.Provider>
  );
}

// 3. Consommer dans n'importe quel enfant
function Button() {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

### Redux (projets complexes - comme gmail-clone)

```jsx
// store/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    login: (state, action) => action.payload,
    logout: () => null,
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;

// Utilisation dans un composant
function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  dispatch(login({ uid: "123", email: "test@email.com" }));
}
```

---

## 7. Routing

### React Router v6

```jsx
// Option 1 : createBrowserRouter (portfolio - recommande)
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/team", element: <Team /> },
  { path: "/contact", element: <Contact /> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

// Option 2 : BrowserRouter + Routes (gmail-clone)
<BrowserRouter>
  <Routes>
    <Route path="/" element={<EmailList />} />
    <Route path="/mail" element={<Mail />} />
  </Routes>
</BrowserRouter>
```

### Navigation

```jsx
// Declarative - liens cliquables
import { NavLink } from "react-router-dom";

<NavLink
  to="/contact"
  className={({ isActive }) => isActive ? styles.active : styles.inactive}
>
  Contact
</NavLink>

// Programmatique - apres une action
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/team");
  };

  return <Button text="Voir l equipe" onClick={handleClick} />;
}
```

### Liens externes vs internes

```jsx
// MAUVAIS - Link/NavLink pour des URLs externes
import { Link } from "react-router-dom";
<Link to="https://instagram.com" target="_blank">Instagram</Link>

// BON - Utiliser <a> pour les liens externes
<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
  Instagram
</a>

// Link/NavLink = uniquement pour la navigation INTERNE de l'app
<NavLink to="/contact">Contact</NavLink>
```

---

## 8. Formulaires

### Composants controles (portfolio)

Le state vit dans le parent, l'enfant recoit `value` et un setter.

```jsx
// Parent
function Contact() {
  const [email, setEmail] = useState("");
  return <Input value={email} setValue={setEmail} placeholder="Email" />;
}

// Enfant - Input controle
function Input({ type, placeholder, value, setValue }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### Convention onChange vs setValue

```jsx
// Style A : passer le setter directement (portfolio)
// Simple, mais l'enfant decide comment extraire la valeur
<Input setValue={setName} />

// Style B : passer un onChange standard (plus flexible)
// Le parent controle totalement la transformation
function Input({ value, onChange, ...rest }) {
  return <input value={value} onChange={onChange} {...rest} />;
}

// Utilisation
<Input value={name} onChange={(e) => setName(e.target.value)} />
```

### react-hook-form (gmail-clone - projets complexes)

```jsx
import { useForm } from "react-hook-form";

function SendMail() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // { to: "...", subject: "...", message: "..." }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("to", { required: true })} type="email" placeholder="To" />
      {errors.to && <span>Ce champ est requis</span>}
      <input {...register("subject")} type="text" placeholder="Subject" />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### Quand utiliser quoi

| Formulaire | Solution |
|---|---|
| 1-3 champs simples | `useState` + composants controles |
| Formulaire complexe avec validation | `react-hook-form` |
| Formulaire tres dynamique (champs conditionnels) | `react-hook-form` + `zod` / `yup` |

---

## 9. Style

### CSS Modules (portfolio)

```jsx
import styles from "../css/button.module.css";

// Acces aux classes via l'objet styles
<button className={styles.btnFilled}>Click</button>

// Classes conditionnelles
<button className={outline ? styles.btnOutline : styles.btnFilled}>
  {text}
</button>

// Plusieurs classes
<div className={`${styles.container} ${styles.active}`}>
```

**Avantages** : Pas de collision de noms, scope local automatique.

### Convention BEM (gmail-clone)

```css
/* Block */
.emailRow { }

/* Block__Element */
.emailRow__title { }
.emailRow__description { }

/* Block--Modifier */
.sidebarOption--active { }
.section--selected { }
```

```jsx
// Classes conditionnelles avec BEM
<div className={`sidebarOption ${selected && "sidebarOption--active"}`}>
```

### Quand utiliser quoi

| Methode | Quand |
|---|---|
| CSS Modules | Par defaut, bon pour tout projet |
| BEM | Si tu preferes le CSS classique avec convention stricte |
| Tailwind CSS | Prototypage rapide, projets moyens/grands |
| styled-components | Si tu veux du CSS-in-JS |

---

## 10. Performance

### Eviter les re-renders inutiles

```jsx
// MAUVAIS - Nouvel objet/tableau a chaque render
function Parent() {
  return <Child style={{ color: "red" }} items={[1, 2, 3]} />;
}

// BON - Definir en dehors ou avec useMemo
const style = { color: "red" };
const items = [1, 2, 3];

function Parent() {
  return <Child style={style} items={items} />;
}
```

### React.memo (composants purs)

```jsx
// Evite le re-render si les props n'ont pas change
const Card = React.memo(function Card({ name, image }) {
  return (
    <div>
      <img src={image} alt={name} />
      <p>{name}</p>
    </div>
  );
});
```

### useCallback pour les fonctions passees en props

```jsx
function Parent() {
  // MAUVAIS - Nouvelle fonction a chaque render
  const handleClick = () => { console.log("click"); };

  // BON - Memoize si l'enfant utilise React.memo
  const handleClick = useCallback(() => {
    console.log("click");
  }, []);

  return <Button onClick={handleClick} />;
}
```

### useMemo pour les calculs couteux

```jsx
function TeamPage({ members }) {
  // Recalcule seulement si members change
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => a.name.localeCompare(b.name));
  }, [members]);

  return sortedMembers.map(m => <Card key={m.id} {...m} />);
}
```

---

## 11. Erreurs courantes a eviter

### 1. Oublier les accolades de destructuration

```jsx
// BUG SILENCIEUX
function Component(title, count) { }     // title = objet props entier

// CORRECT
function Component({ title, count }) { }
```

### 2. Oublier la prop `key` dans les listes

```jsx
// MAUVAIS - Warning React + bugs de re-render
{items.map(item => <Card name={item.name} />)}

// MAUVAIS - Index comme key (probleme si la liste change)
{items.map((item, index) => <Card key={index} name={item.name} />)}

// BON - ID unique et stable
{items.map(item => <Card key={item.id} name={item.name} />)}
```

### 3. Muter le state

```jsx
// BUG - React ne detecte pas le changement
const [user, setUser] = useState({ name: "Emma" });
user.name = "Mike";  // NON !

// CORRECT
setUser(prev => ({ ...prev, name: "Mike" }));
```

### 4. useEffect sans cleanup

```jsx
// BUG - Fuite memoire (event listener jamais supprime)
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);

// CORRECT
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

### 5. Appeler un hook conditionnellement

```jsx
// BUG - Les hooks doivent toujours etre appeles dans le meme ordre
if (isLoggedIn) {
  const [name, setName] = useState("");  // INTERDIT !
}

// CORRECT
const [name, setName] = useState("");
// Utiliser la condition dans le JSX ou la logique, pas autour du hook
```

### 6. Passer des strings au lieu de booleans

```jsx
// MAUVAIS
<Button outline="true" />   // outline recoit la string "true"
<Button outline="" />        // outline recoit la string vide (falsy)

// BON
<Button outline />            // outline = true
<Button outline={false} />    // outline = false
```

### 7. Link pour les URLs externes

```jsx
// MAUVAIS
<Link to="https://google.com">Google</Link>

// BON
<a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>
```

---

## 12. Conventions de nommage

| Element | Convention | Exemple |
|---|---|---|
| Composants | PascalCase | `NavBar`, `EmailRow`, `SocialIcon` |
| Fichiers composants | PascalCase.jsx | `NavBar.jsx`, `Button.jsx` |
| Fonctions / variables | camelCase | `handleSubmit`, `userName` |
| Constantes | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRIES` |
| CSS Modules | camelCase | `styles.btnOutline`, `styles.navContainer` |
| BEM classes | block__element--modifier | `emailRow__title`, `section--selected` |
| Custom hooks | use + PascalCase | `useAuth`, `useFetch`, `useLocalStorage` |
| Context | NomContext | `ThemeContext`, `AuthContext` |
| Redux slices | nomSlice | `userSlice`, `mailSlice` |
| Props booleennes | is/has prefix (optionnel) | `isActive`, `hasError`, `selected` |

---

## 13. Patterns avances

### Custom Hooks (extraire la logique reutilisable)

```jsx
// hooks/useForm.js
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (field) => (e) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
  };

  const reset = () => setValues(initialValues);

  return { values, handleChange, reset };
}

// Utilisation
function Contact() {
  const { values, handleChange, reset } = useForm({
    name: "",
    email: "",
    message: "",
  });

  return (
    <>
      <input value={values.name} onChange={handleChange("name")} />
      <input value={values.email} onChange={handleChange("email")} />
    </>
  );
}
```

### Composition avec children

```jsx
// Composant layout reutilisable
function PageLayout({ children }) {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// Utilisation - plus besoin de repeter NavBar dans chaque page
function Home() {
  return (
    <PageLayout>
      <h1>Bienvenue</h1>
      <p>Contenu de la page</p>
    </PageLayout>
  );
}
```

### Render conditionnel

```jsx
// Ternaire - quand il y a deux cas
{user ? <Dashboard /> : <Login />}

// && - quand il n'y a qu'un cas
{isLoading && <Spinner />}
{error && <ErrorMessage text={error} />}

// Attention au piege avec && et les nombres
{count && <p>{count} items</p>}     // MAUVAIS - affiche "0" si count = 0
{count > 0 && <p>{count} items</p>} // BON
```

### Spread props (passer toutes les props restantes)

```jsx
function Input({ label, ...rest }) {
  return (
    <div>
      <label>{label}</label>
      <input {...rest} />
    </div>
  );
}

// Toutes les props standard de <input> sont transmises
<Input label="Email" type="email" placeholder="ton@email.com" required />
```

---

## Checklist avant de push

- [ ] Tous les composants destructurent leurs props avec `{}`
- [ ] Chaque element dans une liste a une `key` unique et stable
- [ ] Le state n'est jamais mute directement
- [ ] Les useEffect ont un cleanup si necessaire
- [ ] Les hooks ne sont pas appeles conditionnellement
- [ ] Les liens externes utilisent `<a>` et non `<Link>`
- [ ] Les props booleennes sont passees correctement
- [ ] Les noms de props correspondent bien aux donnees passees
- [ ] Pas d'import React inutile (React 17+ avec JSX transform)
- [ ] Les fautes de frappe sont verifiees dans les noms de props
