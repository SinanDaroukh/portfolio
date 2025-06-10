<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const { t } = useI18n();
const altMeBackground = t("alt.MeBackground");
const altSmolMeBackground = t("alt.SmolMeBackground");
</script>

<template>
  <div class="flex flex-col lg:flex-row bg-black w-screen">
    <div
      class="flex flex-col text-white gap-5 lg:w-12/12 items-end text-right justify-center px-8 py-10 lg:pr-16 lg:pl-32 lg:order-first"
    >
      <h1 class="font-museo font-extrabold text-5xl">
        {{ $t("Splashscreen.Sinan") }}
      </h1>
      <!-- <h1>{{ $t("hello", { name: "vue-i18n" }) }}</h1> -->
      <h2 class="text-3xl">{{ $t("Splashscreen.subtitles") }}</h2>
      <div class="w-24 h-1 bg-white"></div>
      <div class="flex gap-4">
        <a
          aria-label="GitHub"
          href="https://github.com/SinanDaroukh"
          class="transition ease-in-out delay-150 rounded-full border-2 p-2 hover:scale-110 duration-300"
          target="_blank"
          ><font-awesome-icon icon="fa-brands fa-github" class="fa-xl"
        /></a>
        <a
          aria-label="LinkedIn"
          href="https://www.linkedin.com/in/sdaroukh/"
          class="transition ease-in-out delay-150 rounded-lg border-2 p-2 hover:scale-110 duration-300"
          target="_blank"
          ><font-awesome-icon
            icon="fa-brands fa-linkedin"
            class="fa-xl hover:fa-2xl"
        /></a>
        <a
          aria-label="Twitter"
          href="https://twitter.com/SinanDaroukh"
          class="transition ease-in-out delay-75 rounded-lg border-2 p-2 hover:scale-110 duration-300"
          target="_blank"
        >
          <font-awesome-icon icon="fa-brands fa-square-twitter" class="fa-xl"
        /></a>
        <a
          aria-label="Email"
          href="mailto:s.daroukh@pm.me"
          class="transition ease-in-out delay-75 rounded-lg border-2 p-2 hover:scale-110 duration-300 flex gap-2"
          target="_blank"
        >
          <font-awesome-icon icon="fa-solid fa-envelope" class="fa-xl"
        /></a>
      </div>
      <p class="italic">
        {{ $t("Splashscreen.intro-1") }}
      </p>
      <p class="italic">
        {{ $t("Splashscreen.intro-2") }}
      </p>
    </div>

    <div class="w-full lg:order-last lg:w-0/12 hidden lg:flex">
      <img
        :alt="altMeBackground"
        class="object-scale-down lg:object-cover w-full lg:h-screen"
        src="/img/me-background.webp"
      />
    </div>
    <div class="w-full flex justify-center order-first lg:hidden py-8">
      <div class="w-6/12 sm:w-4/12 px-4">
        <img
          :alt="altSmolMeBackground"
          src="/img/smol-me-avatar.webp"
          class="shadow rounded-full max-w-full h-auto align-middle border-none object"
        />
      </div>
    </div>
  </div>
</template>
