<script setup>
// Mentions légales — page légale française, non traduite (document juridique).
// Réutilise la mise en page long-form du reader C9.
usePageSeo({
  title: "Mentions légales — Sinan Daroukh · C9 Corp",
  description: "Mentions légales du site de Sinan Daroukh (C9 Corp) : éditeur, hébergement, propriété intellectuelle et données personnelles.",
});
</script>

<template>
  <article class="c9-reader">
    <header class="c9-reader__head">
      <span class="c9-eyebrow">Informations légales</span>
      <h1 class="c9-reader__title">Mentions légales</h1>
      <p class="c9-reader__lead">En vigueur au 3 juillet 2026.</p>
      <hr class="c9-rule" />
    </header>

    <div class="c9-reader__body">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>sinan.daroukh.fr</strong> est édité par
        <strong>Sinan DAROUKH</strong>, entrepreneur individuel exerçant sous le
        nom commercial <strong>C9 CORP.</strong>
      </p>
      <ul>
        <li>Siège social : 47 rue Vivienne, 75002 Paris, France</li>
        <li>SIREN : 104 569 157 — SIRET (siège) : 104 569 157 00019</li>
        <li>Code APE : 62.02A — Conseil en systèmes et logiciels informatiques</li>
        <li>TVA : non applicable, article 293 B du Code général des impôts</li>
        <li>
          Contact : <ProtectedEmail :address="C9_EMAIL_CONTACT" />
        </li>
      </ul>
      <p>Directeur de la publication : Sinan Daroukh.</p>

      <h2>Hébergement</h2>
      <p>Le site est hébergé par :</p>
      <ul>
        <li>Vercel Inc.</li>
        <li>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
        <li>
          Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
        </li>
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments composant ce site (textes, images, logos,
        charte graphique, code) est la propriété exclusive de Sinan Daroukh,
        sauf mention contraire. Toute reproduction, représentation,
        modification ou exploitation, totale ou partielle, sans autorisation
        écrite préalable est interdite et constituerait une contrefaçon au
        sens des articles L.335-2 et suivants du Code de la propriété
        intellectuelle.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les données que vous transmettez par e-mail ou en réservant un appel
        (nom, adresse e-mail, contenu du message, créneau choisi) sont
        utilisées uniquement pour répondre à votre demande. Elles ne sont ni
        cédées ni vendues à des tiers, et sont conservées pendant la durée
        nécessaire au traitement de la demande et aux échanges commerciaux qui
        peuvent en découler. La réservation d'un appel passe par le service
        Calendly, soumis à sa propre politique de confidentialité
        (<a href="https://calendly.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">calendly.com</a>).
      </p>
      <p>
        Conformément au Règlement général sur la protection des données
        (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit
        d'accès, de rectification, d'effacement, d'opposition et de
        portabilité sur vos données. Pour l'exercer, écrivez à
        <ProtectedEmail :address="C9_EMAIL_CONTACT" />. Vous pouvez
        également introduire une réclamation auprès de la CNIL
        (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
      </p>

      <h2>Mesure d'audience et performances</h2>
      <p>
        Ce site utilise Vercel Web Analytics et Vercel Speed Insights,
        fournis par l'hébergeur Vercel Inc., pour mesurer sa fréquentation
        (pages vues, pays, type d'appareil et de navigateur, site de
        provenance) et ses performances de chargement. Ces outils ne
        déposent aucun cookie et n'utilisent pas d'identifiant persistant :
        les visiteurs ne peuvent pas être suivis d'un jour à l'autre ni d'un
        site à l'autre, et seules des statistiques agrégées sont consultées.
        Ces données sont traitées par Vercel aux États-Unis, dans le cadre du
        Data Privacy Framework UE–États-Unis
        (<a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">politique de Vercel</a>).
      </p>

      <h2>Cookies</h2>
      <p>
        Ce site n'utilise ni cookie publicitaire ni cookie de mesure
        d'audience. Deux cookies fonctionnels mémorisent vos préférences :
        <code>i18n_redirected</code> pour la langue et <code>c9-theme</code>
        pour le thème clair ou sombre. Ils sont exemptés de consentement au
        sens des recommandations de la CNIL.
      </p>

      <h2>Liens hypertextes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers. Sinan Daroukh
        n'exerce aucun contrôle sur ces sites et décline toute responsabilité
        quant à leur contenu.
      </p>
    </div>
  </article>
</template>
