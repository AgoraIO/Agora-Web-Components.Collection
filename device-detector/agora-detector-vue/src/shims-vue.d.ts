declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
