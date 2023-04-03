<template>
  <div class="text-sm flex flex-col justify-between min-h-screen">
    <div class="flex justify-center">
      <div class="flex flex-col px-2 py-4 max-w-screen-lg w-full">
        <h1 class="text-2xl font-medium text-gray-900 text-center">Online multilingual sitemap builder</h1>
        <div v-for="(link, i) in links" class="mt-4">
          <div
            class="flex flex-row gap-4 items-center bg-yellow-400 rounded-t-lg p-4"
            :class="{ 'rounded-b-lg': link.translations.length === 0 }"
          >
            <input
              v-model="link.url"
              type="text"
              placeholder="URL"
              class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300"
            />
            <input
              v-model="link.lang"
              type="text"
              placeholder="lang"
              class="block p-2 w-16 text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300"
            />
            <button
              class="block p-2 w-44 font-medium text-center text-black bg-yellow-200 rounded-lg hover:bg-yellow-300 border-2 border-black"
              @click="addTranslation(i)"
            >
              Add Translation
            </button>
            <button
              class="block p-2 w-20 font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 border-2 disabled:bg-gray-400 border-black"
              @click="remove(i)"
              :disabled="disabled"
            >
              Delete
            </button>
          </div>
          <div v-if="link.translations.length > 0" class="flex flex-col gap-4 bg-yellow-200 rounded-b-lg p-4">
            <div v-for="(t, j) in link.translations" class="flex flex-raw gap-4 items-center">
              <input
                v-model="t.url"
                type="text"
                placeholder="URL"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300"
              />
              <input
                v-model="t.lang"
                type="text"
                placeholder="lang"
                class="block p-2 w-16 text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300"
              />
              <button
                class="block p-2 w-52 font-medium text-center text-white bg-violet-700 rounded-lg hover:bg-violet-800 border-2 disabled:bg-gray-400 border-black"
                @click="removeTranslation(i, j)"
              >
                Delete Translation
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-2 justify-center mt-4">
          <button
            class="p-2 font-medium text-center text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:bg-gray-400 border-2 border-black"
            @click="add"
          >
            Add New Page
          </button>
        </div>
        <div class="relative p-2 mt-4 border-2 border-black rounded-lg bg-[#1e1e1e]" role="alert">
          <Copy
            @click="copy"
            class="absolute top-2 right-2 text-white cursor-pointer"
            :class="{ 'animate-bounce': copying }"
          />
          <highlightjs language="xml" :code="result" />
        </div>
      </div>
    </div>
    <div class="bg-neutral-100 text-center p-5">
      View code on <a href="https://github.com/leshkin/sitemap" class="text-blue-600">GitHub</a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { js2xml } from '~/utils/js2xml'

const HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n'
const URLSET = {
  urlset: {
    _attributes: {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
    },
    url: [],
  },
}
const copying = ref(false)
const links = ref([{ url: '', lang: '', translations: [] }])

const result = computed(() => {
  let urls = []
  for (let link of links.value) {
    let translations = []
    translations.push({
      _attributes: {
        rel: 'alternate',
        hreflang: link.lang,
        href: link.url,
      },
    })
    for (let t of link.translations) {
      if (t.lang && t.url) {
        translations.push({
          _attributes: {
            rel: 'alternate',
            hreflang: t.lang,
            href: t.url,
          },
        })
      }
    }
    if (link.url && link.lang) {
      urls.push({ loc: link.url, 'xhtml:link': translations })
    }
    if (translations.length > 1) {
      for (let t of link.translations) {
        if (t.url && t.lang) {
          urls.push({ loc: t.url, 'xhtml:link': translations })
        }
      }
    }
  }
  URLSET.urlset.url = urls
  return HEADER + js2xml(URLSET, { compact: true, ignoreComment: true, spaces: 2 })
})

const disabled = computed(() => {
  return links.value.length === 1
})

function add() {
  links.value.push({ url: '', lang: '', translations: [] })
}

function addTranslation(i) {
  links.value[i].translations.push({ url: '', lang: '' })
}

function remove(i) {
  links.value.splice(i, 1)
}

function removeTranslation(i, j) {
  links.value[i].translations.splice(j, 1)
}

function copy() {
  copying.value = true
  navigator.clipboard.writeText(result.value)
  setTimeout(() => {
    copying.value = false
  }, 1500)
}
</script>
