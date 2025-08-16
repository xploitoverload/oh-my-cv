type Category = "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
type Subset = "arabic" | "bengali" | "chinese-simplified" | "chinese-traditional" | "cyrillic" | "cyrillic-ext" | "devanagari" | "greek" | "greek-ext" | "gujarati" | "gurmukhi" | "hebrew" | "japanese" | "kannada" | "khmer" | "korean" | "latin" | "latin-ext" | "malayalam" | "myanmar" | "oriya" | "sinhala" | "tamil" | "telugu" | "thai" | "vietnamese";
type Variant = "100" | "100italic" | "200" | "200italic" | "300" | "300italic" | "regular" | "italic" | "500" | "500italic" | "600" | "600italic" | "700" | "700italic" | "800" | "800italic" | "900" | "900italic";
type Font = {
    family: string;
    id: string;
    category: Category;
    subsets: Subset[];
    variants: Variant[];
    kind?: string;
    version?: string;
    lastModified?: string;
    files?: Record<Variant, string>;
};
type FontMap = Map<string, Font>;
type SortOption = "alphabet" | "popularity";
type Options = {
    families?: string[];
    categories?: Category[];
    subsets?: Subset[];
    variants?: Variant[];
    filter?: (font: Font) => boolean;
    limit?: number;
    sort?: SortOption;
};

declare class GoogleFontsLoader {
    private readonly apiKey;
    private readonly options;
    private activeFontFamily;
    private onChange;
    private fontMap;
    constructor(apiKey: string, { families, categories, subsets, variants, filter, limit, sort }?: Options, onChange?: (font: Font) => void);
    init(): Promise<FontMap>;
    getFontMap(): FontMap;
    getActiveFont(): Font;
    /**
     * Set the specified font as the active font and download it
     */
    setActiveFont(fontFamily: string): Promise<void>;
    setOnChange(onChange: (font: Font) => void): void;
}

export { type Category, type Font, type FontMap, GoogleFontsLoader, type Options, type SortOption, type Subset, type Variant, GoogleFontsLoader as default };
