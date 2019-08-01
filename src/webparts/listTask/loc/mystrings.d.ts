declare interface IListTaskWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
    NameWebPartLabel: string;
    ListURLFieldLabel: string;
    SliderItems: number;
    SelectListDropdawn: string;
    FilterFieldLabel: string;
    SelectFieldLabel: string;
    WelcomeTitle: string;
    ChoiceTheList: string;
    ErrorMessage: string;
    PlacegolderSelectItems: string;
    PlacegolderFilterItems: string;
    PlacegolderNameWebPart: string;
    PlacegolderListUrl: string;
}

declare module 'ListTaskWebPartStrings' {
  const strings: IListTaskWebPartStrings;
  export = strings;
}
