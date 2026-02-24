import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as TiIcons from 'react-icons/ti';
import * as GoIcons from 'react-icons/go';
import * as FiIcons from 'react-icons/fi';
import * as LuIcons from 'react-icons/lu';
import * as GiIcons from 'react-icons/gi';
import * as WiIcons from 'react-icons/wi';
import * as DiIcons from 'react-icons/di';
import * as BsIcons from 'react-icons/bs';
import * as RiIcons from 'react-icons/ri';
import * as FcIcons from 'react-icons/fc';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import * as Hi2Icons from 'react-icons/hi2';
import * as SiIcons from 'react-icons/si';
import * as SlIcons from 'react-icons/sl';
import * as ImIcons from 'react-icons/im';
import * as BiIcons from 'react-icons/bi';
import * as CgIcons from 'react-icons/cg';
import * as VscIcons from 'react-icons/vsc';
import * as TbIcons from 'react-icons/tb';
import * as TfiIcons from 'react-icons/tfi';
import * as RxIcons from 'react-icons/rx';
import * as PiIcons from 'react-icons/pi';
import * as LiaIcons from 'react-icons/lia';
import * as CiIcons from 'react-icons/ci';

// Map of icon pack prefixes to their imported modules
export const iconPacks: Record<string, Record<string, any>> = {
  Fa: FaIcons,
  Fa6: Fa6Icons,
  Md: MdIcons,
  Ai: AiIcons,
  Io: IoIcons,
  Io5: Io5Icons,
  Ti: TiIcons,
  Go: GoIcons,
  Fi: FiIcons,
  Lu: LuIcons,
  Gi: GiIcons,
  Wi: WiIcons,
  Di: DiIcons,
  Bs: BsIcons,
  Ri: RiIcons,
  Fc: FcIcons,
  Gr: GrIcons,
  Hi: HiIcons,
  Hi2: Hi2Icons,
  Si: SiIcons,
  Sl: SlIcons,
  Im: ImIcons,
  Bi: BiIcons,
  Cg: CgIcons,
  Vsc: VscIcons,
  Tb: TbIcons,
  Tfi: TfiIcons,
  Rx: RxIcons,
  Pi: PiIcons,
  Lia: LiaIcons,
  Ci: CiIcons
};

/**
 * Gets all available icon names from all supported icon packs
 */
export function getAllIconNames(): string[] {
  const allIcons: string[] = [];
  
  Object.entries(iconPacks).forEach(([prefix, pack]) => {
    Object.keys(pack)
      .filter(key => typeof pack[key] === 'function' && !key.startsWith('__'))
      .forEach(iconName => {
        allIcons.push(iconName);
      });
  });
  
  return allIcons;
}

/**
 * Gets filtered icons by pack and search term
 * @param searchTerm The search term to filter icons by
 * @param limit Maximum number of results to return (optional)
 * @param packPrefix Filter by specific icon pack prefix (optional)
 */
export function searchIcons(searchTerm: string, limit?: number, packPrefix?: string): string[] {
  const trimmed = searchTerm.trim();
  const lowerSearchTerm = trimmed.toLowerCase();
  let results: string[] = [];
  
  // If a specific pack is specified, use it regardless of search term
  if (packPrefix && iconPacks[packPrefix]) {
    const pack = iconPacks[packPrefix];
    results = Object.keys(pack)
      .filter(key => 
        typeof pack[key] === 'function' && 
        !key.startsWith('__') &&
        (!trimmed || key.toLowerCase().includes(lowerSearchTerm))
      );
  } else if (trimmed) {
    // If no pack specified but search term exists, search across all packs
    const seen = new Set<string>();
    Object.entries(iconPacks).forEach(([prefix, pack]) => {
      const packResults = Object.keys(pack)
        .filter(key => 
          typeof pack[key] === 'function' && 
          !key.startsWith('__') &&
          key.toLowerCase().includes(lowerSearchTerm)
        );
      packResults.forEach(icon => {
        if (!seen.has(icon)) {
          seen.add(icon);
          results.push(icon);
        }
      });
    });
  } else {
    // Empty search with no specific pack - return empty array as we should show defaults
    return [];
  }
  
  // Sort by relevance: exact suffix match first (e.g. FaSlack for "slack"), then earlier match, then shorter names
  if (trimmed && results.length > 0) {
    results.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aSuffix = aLower.endsWith(lowerSearchTerm) ? 0 : 1;
      const bSuffix = bLower.endsWith(lowerSearchTerm) ? 0 : 1;
      if (aSuffix !== bSuffix) return aSuffix - bSuffix;
      const aIdx = aLower.indexOf(lowerSearchTerm);
      const bIdx = bLower.indexOf(lowerSearchTerm);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.length - b.length;
    });
  }
  
  return limit ? results.slice(0, limit) : results;
} 