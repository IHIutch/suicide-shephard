<template>
  <Layout>
    <b-container fluid>
      <b-row>
        <b-col
          md="3"
          lg="2"
          class="position-fixed top-0 left-0 bottom-0 px-0 bg-light"
        >
          <div class="p-3 h-100 overflow-auto">
            <h2>Filters</h2>
            <div class="mb-4">
              <div>
                <span
                  class="text-sm font-weight-semibold text-uppercase tracking-wider"
                >
                  Published Date
                </span>
              </div>
              <div>
                <b-form-datepicker
                  id="publishStart"
                  v-model="filter.publishStart"
                  placeholder="Start date"
                  class="mb-2"
                  hide-header
                ></b-form-datepicker>
                <b-form-datepicker
                  id="publishEnd"
                  v-model="filter.publishEnd"
                  placeholder="End date"
                  hide-header
                ></b-form-datepicker>
              </div>
            </div>
            <div class="mb-4">
              <div>
                <span
                  class="text-sm font-weight-semibold text-uppercase tracking-wider"
                >
                  Artist
                </span>
              </div>
              <div>
                <b-form-group label="Artists">
                  <b-form-checkbox-group
                    v-model="filter.artist"
                    :options="artistList"
                    name="artist"
                    stacked
                  ></b-form-checkbox-group>
                </b-form-group>
              </div>
            </div>
            <div class="mb-4">
              <div>
                <span
                  class="text-sm font-weight-semibold text-uppercase tracking-wider"
                >
                  Tag
                </span>
              </div>
              <div>
                <b-form-group label="Tags">
                  <b-form-checkbox-group
                    v-model="filter.tag"
                    :options="tagList"
                    name="tag"
                    stacked
                  ></b-form-checkbox-group>
                </b-form-group>
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="9" lg="10" class="ml-auto">
          <div
            v-for="(sound, idx) in filteredSounds"
            class="border rounded mb-4 p-4"
          >
            <div class="d-flex justify-content-between">
              <div>
                <a :href="sound.link">{{ sound.artist }} - {{ sound.title }}</a>
              </div>
              <div>
                <span>
                  {{ sound.datePosted | dayjs("MMM D, YYYY") }}
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
      filter: {
        publishStart: "",
        publishEnd: "",
        artist: [],
        tag: [],
      },
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
  computed: {
    artistList() {
      return [...new Set(this.sounds.map((sound) => sound.artist))].sort();
    },
    tagList() {
      return [...new Set(this.sounds.map((sound) => sound.tag))].sort();
    },
    filteredSounds() {
      let arr = this.sounds;

      if (this.filter.artist.length) {
        arr = arr.filter((sound) => {
          return this.filter.artist.indexOf(sound.artist) !== -1;
        });
      }
      if (this.filter.tag.length) {
        arr = arr.filter((sound) => {
          return this.filter.tag.indexOf(sound.tag) !== -1;
        });
      }

      return arr;
    },
  },
  filters: {
    dayjs(val, format) {
      return dayjs(val).format(format);
    },
  },
};
</script>
