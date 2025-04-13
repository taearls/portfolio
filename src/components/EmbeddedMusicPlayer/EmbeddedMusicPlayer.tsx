export default function EmbeddedMusicPlayer() {
  return <div>Embedded Music Player</div>;
}

{
  /* <template>
  <client-only>
    <iframe
      rel="preconnect"
      title="Embedded Bandcamp Music Player"
      style="border: 0; height: 120px;"
      :class="{'desktop-embedded-player': isMaxWidth, 'mobile-embedded-player': !isMaxWidth}"
      :src="embeddedPlayerSrc"
      seamless
    ><a href="https://cuckooandthebirds.bandcamp.com/track/show-me-the-dark"
      >Show Me The Dark by Cuckoo and the Birds</a
      ></iframe>
  </client-only>
</template>

<script>
export default {
  props: {
    prefersDarkMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isMaxWidth: false,
    };
  },
  computed: {
    embeddedPlayerSrc() {
      if (this.prefersDarkMode) {
        return "https://bandcamp.com/EmbeddedPlayer/track=409658071/size=large/bgcol=333333/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/";
      }
      return "https://bandcamp.com/EmbeddedPlayer/track=409658071/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/";
    },
  },
  beforeMount() {
    this.checkIsMaxWidth();
    window.addEventListener("resize", this.checkIsMaxWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkIsMaxWidth);
  },
  methods: {
    checkIsMaxWidth() {
      // has to be 700px; that's the full width of the embedded player
      if (window.innerWidth >= 700) {
        this.isMaxWidth = true;
      } else {
        this.isMaxWidth = false;
      }
    },
  },
};
</script>

<style scoped>
iframe {
  display: block;
  position: fixed;
  left: 0;
  bottom: 0;
  transition: width 200ms linear;
}
.desktop-embedded-player {
  width: 700px;
}
.mobile-embedded-player {
  @apply w-full;
}
</style> */
}
