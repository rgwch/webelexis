<script lang="ts">
import { onMount, onDestroy, createEventDispatcher } from "svelte";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
const dispatch = createEventDispatcher();

export let contents;
export let extensions = [];
export let editable = true;

let element;
let editor;

/*
$: {
  console.log("Changed "+contents)
  editor?.commands.setContent(contents)
}
*/

onMount(() => {
  editor = new Editor({
    editorProps: {
      attributes: {
        class: "bg-blue-200",
      },
    },
    element: element,
    extensions: [StarterKit, ...extensions],
    content: contents,
    editable,
    onBlur: () => {
      dispatch("changed", editor.getJSON());
    },
    onTransaction: (event) => {
      // force re-render so `editor.isActive` works as expected
      editor = editor;
    },
  });
});

onDestroy(() => {
  if (editor) {
    editor.destroy();
  }
});
</script>

<template>
  {#if editor}
    <button
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 1 }).run()}"
      class:active="{editor.isActive('heading', { level: 1 })}">
      H1
    </button>
    <button
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 2 }).run()}"
      class:active="{editor.isActive('heading', { level: 2 })}">
      H2
    </button>
    <button
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:active="{editor.isActive('paragraph')}">
      P
    </button>
  {/if}
  <div bind:this="{element}" class="border-2"></div>

  <style>
  button.active {
    background: black;
    color: white;
  }
  </style>
</template>
