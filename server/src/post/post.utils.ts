export function parseTags(content: string) {
  return (
    content.match(/#\w+/g)?.map(x => {
      return { name: x.substr(1) };
    }) || []
  );
}
