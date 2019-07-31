declare interface IListTaskWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
    NameWebPartLabel: string;
    ListURLFieldLabel: string;
    SliderItems: number;
    FilterFieldLabel: string;
    SelectFieldLabel: string;
}

declare module 'ListTaskWebPartStrings' {
  const strings: IListTaskWebPartStrings;
  export = strings;
}
