<template>
    <view id="markdown-body" class="markdown-body">
        <rich-text :nodes="previewContent" />
    </view>
</template>

<script >
import 'highlight.js/styles/stackoverflow-light.css'
// @ts-ignore
import MarkdownIt from 'markdown-it'
// @ts-ignore
import MarkdownItSub from 'markdown-it-sub'
// @ts-ignore
import MarkdownItSup from 'markdown-it-sup'
// @ts-ignore
import MarkdownItFootnote from 'markdown-it-footnote'
// @ts-ignore
import MarkdownItAbbr from 'markdown-it-abbr'
// @ts-ignore
import MarkdownItMark from 'markdown-it-mark'
// @ts-ignore
import { full as emoji } from 'markdown-it-emoji'
// @ts-ignore
import MarkdownItTextualUml from 'markdown-it-textual-uml'
// @ts-ignore
import MarkdownItHighlightjs from 'markdown-it-highlightjs'
// @ts-ignore
import MarkdownItAttrs from 'markdown-it-attrs'

const markdown = new MarkdownIt()

markdown.use(MarkdownItSub)
markdown.use(MarkdownItSup)
markdown.use(MarkdownItFootnote)
markdown.use(MarkdownItAbbr)
markdown.use(MarkdownItMark)
markdown.use(emoji)
markdown.use(MarkdownItTextualUml)
markdown.use(MarkdownItHighlightjs)
markdown.use(MarkdownItAttrs)

export default {
    name: 'Markdown',
    props: {
        content: String
    },
    computed: {
        previewContent() {
            return markdown.render(this.content)
        }
    },
}
</script>

<style scoped lang="scss">
pre.hljs {
    background-color: #f4f4f4;
    padding: 10px;
}

pre.hljs code {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 14px;
}
</style>
