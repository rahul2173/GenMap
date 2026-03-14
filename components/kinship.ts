
import { FamilyMember, RelationType } from '../types';

export const describeKinshipPath = (path: RelationType[], target: FamilyMember): string => {
    if (path.length === 0) return 'You';
    
    const isMale = target.gender === 'male';
    const isFemale = target.gender === 'female';
    
    // Helper to add "Great" prefixes
    const getGreatPrefix = (count: number) => {
      if (count <= 0) return "";
      if (count === 1) return "Great-";
      return "Great-".repeat(count);
    };

    // Calculate depth changes
    const up = path.filter(p => p === 'parent').length;
    const down = path.filter(p => p === 'child').length;
    const hasSibling = path.includes('sibling');
    const hasSpouse = path.includes('spouse');

    // 1. Direct Ancestry
    if (!hasSibling && !hasSpouse && up > 0 && down === 0) {
      if (up === 1) return isMale ? 'Father' : isFemale ? 'Mother' : 'Parent';
      if (up === 2) return isMale ? 'Grandfather' : isFemale ? 'Grandmother' : 'Grandparent';
      const greats = up - 2;
      return `${getGreatPrefix(greats)}Grand${isMale ? 'father' : isFemale ? 'mother' : 'parent'}`;
    }

    // 2. Direct Descendancy
    if (!hasSibling && !hasSpouse && down > 0 && up === 0) {
      if (down === 1) return isMale ? 'Son' : isFemale ? 'Daughter' : 'Child';
      if (down === 2) return isMale ? 'Grandson' : isFemale ? 'Granddaughter' : 'Grandchild';
      const greats = down - 2;
      return `${getGreatPrefix(greats)}Grand${isMale ? 'son' : isFemale ? 'daughter' : 'child'}`;
    }

    // 3. Collateral (Siblings, Nephews, Nieces)
    if (hasSibling && up === 0) {
      if (down === 0) return isMale ? 'Brother' : isFemale ? 'Sister' : 'Sibling';
      if (down === 1) return isMale ? 'Nephew' : isFemale ? 'Niece' : 'Niece/Nephew';
      const greats = down - 1;
      return `${getGreatPrefix(greats)}Grand${isMale ? 'nephew' : isFemale ? 'niece' : 'niece/nephew'}`;
    }

    // 4. Aunts/Uncles
    if (hasSibling && up > 0 && down === 0) {
      if (up === 1) return isMale ? 'Uncle' : isFemale ? 'Aunt' : 'Aunt/Uncle';
      const greats = up - 1;
      return `${getGreatPrefix(greats)}Grand${isMale ? 'uncle' : isFemale ? 'aunt' : 'uncle/aunt'}`;
    }

    // 5. Cousins (Algorithmic)
    if (up > 0 && down > 0) {
      const commonDepth = Math.min(up, down);
      const degree = commonDepth;
      const removal = Math.abs(up - down);
      
      const ordinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      const degreeStr = ordinal(degree);
      const removalStr = removal === 0 ? "" : ` ${removal === 1 ? "Once" : removal === 2 ? "Twice" : removal + "x"} Removed`;
      return `${degreeStr} Cousin${removalStr}`;
    }

    // 6. In-Laws / Spousal Logic
    if (hasSpouse) {
      if (path.length === 1) return isMale ? 'Husband' : isFemale ? 'Wife' : 'Spouse';
      
      // Determine base relation then append -in-law
      if (path[path.length - 1] === 'spouse') {
        const subRelation = describeKinshipPath(path.slice(0, -1), target);
        
        // Direct ancestor/descendant spouse logic
        if (subRelation.toLowerCase().includes('father')) {
          return isMale ? subRelation : subRelation.replace(/father/gi, 'mother');
        }
        if (subRelation.toLowerCase().includes('mother')) {
          return isFemale ? subRelation : subRelation.replace(/mother/gi, 'father');
        }
        if (subRelation.toLowerCase().includes('grandfather')) {
          return isMale ? subRelation : subRelation.replace(/grandfather/gi, 'grandmother');
        }
        if (subRelation.toLowerCase().includes('grandmother')) {
          return isFemale ? subRelation : subRelation.replace(/grandmother/gi, 'grandfather');
        }

        if (subRelation === 'Son') return 'Son-in-law';
        if (subRelation === 'Daughter') return 'Daughter-in-law';
        if (subRelation === 'Brother') return 'Brother-in-law';
        if (subRelation === 'Sister') return 'Sister-in-law';
        if (subRelation === 'Father') return 'Father-in-law';
        if (subRelation === 'Mother') return 'Mother-in-law';
        if (subRelation.includes('Grandparent')) {
          if (isMale) return subRelation.replace('Grandparent', 'Grandfather-in-law');
          if (isFemale) return subRelation.replace('Grandparent', 'Grandmother-in-law');
        }
        return `${subRelation}-in-law`;
      }
      if (path[0] === 'spouse') {
        const subRelation = describeKinshipPath(path.slice(1), target);
        
        // Direct ancestor/descendant spouse logic
        if (subRelation.toLowerCase().includes('father')) {
          return isMale ? subRelation : subRelation.replace(/father/gi, 'mother');
        }
        if (subRelation.toLowerCase().includes('mother')) {
          return isFemale ? subRelation : subRelation.replace(/mother/gi, 'father');
        }
        if (subRelation.toLowerCase().includes('grandfather')) {
          return isMale ? subRelation : subRelation.replace(/grandfather/gi, 'grandmother');
        }
        if (subRelation.toLowerCase().includes('grandmother')) {
          return isFemale ? subRelation : subRelation.replace(/grandmother/gi, 'grandfather');
        }

        if (subRelation === 'Father') return 'Father-in-law';
        if (subRelation === 'Mother') return 'Mother-in-law';
        if (subRelation === 'Brother') return 'Brother-in-law';
        if (subRelation === 'Sister') return 'Sister-in-law';
        if (subRelation.includes('Grandparent')) {
          if (isMale) return subRelation.replace('Grandparent', 'Grandfather-in-law');
          if (isFemale) return subRelation.replace('Grandparent', 'Grandmother-in-law');
        }
        return `${subRelation}-in-law`;
      }
    }

    return isMale ? 'Kinsman' : isFemale ? 'Kinswoman' : 'Kinsfolk';
  };

export const getRelativeRelationship = (targetId: string, currentUserId: string, members: FamilyMember[]): string => {
    if (targetId === currentUserId) return 'You';
    
    // Breadth-first search to find shortest path of relationships
    const queue: { id: string, path: RelationType[] }[] = [{ id: currentUserId, path: [] }];
    const visited = new Map<string, RelationType[]>();
    visited.set(currentUserId, []);

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      const member = members.find(m => m.id === id);
      if (!member) continue;

      if (id === targetId) {
        return describeKinshipPath(path, member);
      }

      for (const conn of member.connections) {
        if (!visited.has(conn.toId)) {
          const newPath = [...path, conn.type];
          visited.set(conn.toId, newPath);
          queue.push({ id: conn.toId, path: newPath });
        }
      }
    }
    return 'Blood Relation';
  };
