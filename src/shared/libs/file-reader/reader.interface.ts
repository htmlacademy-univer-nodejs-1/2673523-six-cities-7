export interface Reader<T> {
  read(): AsyncIterable<T>;
}
