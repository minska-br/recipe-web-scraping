export default function truncateText(value: string, lenght = 100) {
  return `${value.substr(0, lenght)}...`;
}
