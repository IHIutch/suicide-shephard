<template>
  <Layout>
    <b-navbar type="light" variant="dark" sticky>
      <b-nav-form>
        <b-form-input
          class="mr-sm-2"
          placeholder="Search"
          v-model="filter.search"
        ></b-form-input>
      </b-nav-form>
    </b-navbar>
    <b-container fluid>
      <b-row>
        <b-col
          md="3"
          lg="2"
          class="position-fixed top-0 left-0 bottom-0 px-0 bg-light pt-12 z-1"
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
                <date-picker
                  v-model="filter.dates"
                  mode="range"
                  :popover="{ visibility: 'focus' }"
                />
              </div>
              <!-- <div>
                <b-form-datepicker
                  id="publishStart"
                  v-model="filter.publishStart"
                  placeholder="Start date"
                  class="mb-2"
                  hide-header
                  :date-format-options="{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  }"
                ></b-form-datepicker>
                <b-form-datepicker
                  id="publishEnd"
                  v-model="filter.publishEnd"
                  placeholder="End date"
                  hide-header
                  :date-format-options="{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  }"
                ></b-form-datepicker>
              </div> -->
            </div>
            <div class="mb-4">
              <b-form-group
                label="Artists"
                label-class="text-sm font-weight-semibold text-uppercase tracking-wider"
              >
                <div>
                  <div v-for="(artist, idx) in filter.artist">
                    <b-button
                      variant="link"
                      size="sm"
                      class="d-flex justify-content-between"
                      block
                    >
                      <span>{{ artist }}</span>
                      <span>x</span>
                    </b-button>
                  </div>
                </div>
                <b-form-checkbox-group
                  v-model="filter.artist"
                  :options="artistList"
                  name="artist"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>
            <div class="mb-4">
              <b-form-group
                label="Tags"
                label-class="text-sm font-weight-semibold text-uppercase tracking-wider"
              >
                <div>
                  <div v-for="(tag, idx) in filter.tag">
                    <b-button
                      variant="link"
                      size="sm"
                      class="d-flex justify-content-between"
                      block
                    >
                      <span>{{ tag }}</span>
                      <span>x</span>
                    </b-button>
                  </div>
                </div>
                <b-form-checkbox-group
                  v-model="filter.tag"
                  :options="tagList"
                  name="tag"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>
          </div>
        </b-col>
        <b-col md="9" lg="10" class="ml-auto">
          <main role="main" class="py-4">
            <transition-group
              name="list-complete"
              tag="div"
              class="position-relative"
            >
              <div
                v-for="(sound, idx) in filteredSounds"
                class="border rounded mb-4 p-4 transition-fast w-100"
                :key="sound.id"
              >
                <div class="d-flex w-100 justify-content-between">
                  <div>
                    <a :href="sound.link"
                      >{{ sound.artist }} - {{ sound.title }}</a
                    >
                  </div>
                  <div>
                    <span>
                      {{ sound.datePosted | dayjs("MMM D, YYYY") }}
                    </span>
                  </div>
                </div>
              </div>
            </transition-group>
          </main>
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
import Velocity from "velocity-animate";

import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  metaInfo: {
    title: "Hello, world!",
  },
  components: {
    DatePicker,
  },
  data() {
    return {
      sounds: [],
      filter: {
        dates: {
          start: "",
          end: "",
        },
        publishStart: "",
        publishEnd: new Date(),
        artist: [],
        tag: [],
        search: "",
      },
    };
  },
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
      if (this.filter.dates.start) {
        arr = arr.filter((sound) => {
          return new Date(sound.datePosted) > new Date(this.filter.dates.start);
        });
      }
      if (this.filter.dates.end) {
        arr = arr.filter((sound) => {
          return new Date(sound.datePosted) < new Date(this.filter.dates.end);
        });
      }
      if (this.filter.search) {
        arr = arr.filter((sound) => {
          return (
            sound.artist.includes(this.filter.search) ||
            sound.title.includes(this.filter.search)
          );
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

<style lang="scss" scoped>
.transition-fast {
  transition: all 0.4s;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.list-complete-leave-active {
  position: absolute;
}
</style>
