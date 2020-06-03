<template>
  <Layout>
    <b-container fluid>
      <b-row>
        <b-col cols="3"></b-col>
        <b-col cols="9">
          <div v-for="(sound, idx) in sounds" class="border rounded mb-4 p-4">
            <div class="d-flex justify-content-between">
              <div>
                <a :href="sound.link">{{ sound.artist }} - {{ sound.title }}</a>
              </div>
              <div>
                <span>
                  {{ sound.datePosted | dayjs("MMMM D, YYYY - h:mmA") }}
                </span>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </Layout>
</template>

<page-query>
query {
  sounds: allSound {
    edges {
      node {
        id
        title
        coverArt
        artist
        datePosted
        tag
        link
      }
    }
  }
}
</page-query>

<script>
import dayjs from "dayjs";

export default {
  metaInfo: {
    title: "Hello, world!",
  },
  data() {
    return {
      sounds: [],
    };
  },
  methods: {},
  created() {
    this.sounds = this.$page.sounds.edges.map((sound) => {
      let node = sound.node;
      return {
        id: node.id,
        title: node.title,
        coverArt: node.coverArt,
        artist: node.artist,
        datePosted: node.datePosted,
        tag: node.tag,
        link: `https://soundcloud.com${node.link}`,
      };
    });
  },
  filters: {
    dayjs(val, format) {
      return dayjs(val).format(format);
    },
  },
};
</script>
