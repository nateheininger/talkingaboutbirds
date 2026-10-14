// People who get their own page at /players/<slug>/ listing every episode that mentions them.
// These pages target searches like "Masyn Winn podcast" or "JJ Wetherholt".
//
// - `aliases`: other spellings or distinctive last names to match. Avoid common last
//   names (Walker, Gray, Church…) because they'd match unrelated words.
// - A page is only generated once someone shows up in at least MIN_EPISODES episodes,
//   so it's safe to add prospects early; their page appears when they've been discussed enough.
//
// To add someone: copy a line, change the name, rebuild.

export const MIN_EPISODES = 3;

export interface Person {
  name: string;
  aliases?: string[];
}

export const PLAYERS: Person[] = [
  { name: 'Jordan Walker' },
  { name: 'Masyn Winn' },
  { name: 'JJ Wetherholt', aliases: ['J.J. Wetherholt', 'Wetherholt'] },
  { name: 'Willson Contreras' },
  { name: 'Nolan Arenado', aliases: ['Arenado'] },
  { name: 'Alec Burleson', aliases: ['Burleson'] },
  { name: 'Sonny Gray' },
  { name: 'Brendan Donovan' },
  { name: 'Ivan Herrera' },
  { name: 'Matthew Liberatore', aliases: ['Liberatore'] },
  { name: 'Dustin May' },
  { name: 'Ryan Helsley', aliases: ['Helsley'] },
  { name: 'Miles Mikolas', aliases: ['Mikolas'] },
  { name: 'Lars Nootbaar', aliases: ['Nootbaar'] },
  { name: 'Nolan Gorman' },
  { name: 'Nathan Church' },
  { name: 'JoJo Romero' },
  { name: 'Steven Matz' },
  { name: 'Tommy Edman', aliases: ['Edman'] },
  { name: 'Victor Scott II', aliases: ['Victor Scott'] },
  { name: 'Lance Lynn' },
  { name: 'Paul Goldschmidt', aliases: ['Goldschmidt'] },
  { name: 'Paul DeJong', aliases: ['DeJong'] },
  { name: 'Dylan Carlson' },
  { name: 'Tyler O\'Neill' },
  { name: 'Jack Flaherty', aliases: ['Flaherty'] },
  { name: 'Jordan Hicks' },
  { name: 'Andre Pallante', aliases: ['Pallante'] },
  { name: 'Giovanny Gallegos' },
  { name: 'Michael McGreevy', aliases: ['McGreevy'] },
  { name: 'Thomas Saggese', aliases: ['Saggese'] },
  { name: 'Luken Baker' },
  { name: 'Pedro Pagés', aliases: ['Pedro Pages'] },
  { name: 'Matt Carpenter' },
  { name: 'Adam Wainwright', aliases: ['Wainwright'] },
  { name: 'Yadier Molina', aliases: ['Yadi'] },
  { name: 'Albert Pujols', aliases: ['Pujols'] },
  { name: 'Blaze Jordan' },
  { name: 'Jimmy Crooks' },
  { name: 'Chase Davis' },
  { name: 'Josh Baez' },
  { name: 'Kyle Leahy' },
  { name: 'Tink Hence' },
  { name: 'Quinn Mathews', aliases: ['Quinn Matthews'] },
  { name: 'Jurrangelo Cijntje', aliases: ['Cijntje'] },
  { name: 'Rainiel Rodriguez' },
  { name: 'Ryan Fernandez' },
  { name: 'Packy Naughton' },
  { name: 'Drew Rom' },
  { name: 'Moises Gomez' },
  // Front office and managers
  { name: 'Chaim Bloom' },
  { name: 'John Mozeliak', aliases: ['Mozeliak'] },
  { name: 'Oli Marmol', aliases: ['Oliver Marmol', 'Olie Marmol', 'Marmol'] },
  { name: 'Mike Shildt', aliases: ['Shildt'] },
];
