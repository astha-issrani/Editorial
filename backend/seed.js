import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';
import Category from './models/Category.js';
import Affiliate from './models/Affiliate.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/the-editorial';

const categories = [
  { name: 'Culture', slug: 'culture' },
  { name: 'Design', slug: 'design' },
  { name: 'Tech', slug: 'tech' },
  { name: 'Business', slug: 'business' },
  { name: 'Sustainability', slug: 'sustainability' },
  { name: 'Art', slug: 'art' },
  { name: 'Architecture', slug: 'architecture' },
  { name: 'Travel', slug: 'travel' },
  { name: 'Science', slug: 'science' },
  { name: 'Typography', slug: 'typography' },
  { name: 'Workspace', slug: 'workspace' },
];

const affiliates = [
  { name: 'Ugmonk', url: 'https://ugmonk.com', description: 'Beautifully crafted minimal workspace accessories.', category: 'Workspace' },
  { name: 'Muji', url: 'https://muji.com', description: 'Japanese minimalist lifestyle brand.', category: 'Lifestyle' },
  { name: 'Are.na', url: 'https://www.are.na', description: 'A collaborative research tool for everyone.', category: 'Tools' },
  { name: 'Notion', url: 'https://notion.so', description: 'All-in-one workspace for notes and projects.', category: 'Tools' },
];

const samplePosts = [
  {
    title: 'The Silent Architecture of Digital Governance',
    excerpt: 'A deep exploration into how minimalist design systems and algorithmic frameworks are reshaping our understanding of institutional authority in the twenty-first century.',
    content: `<p>In the shadow of gleaming server farms and beneath the hum of fiber-optic cables, a new kind of architecture has emerged—one that governs not with walls and corridors, but with code and constraint.</p>
<h2>The Invisible Infrastructure</h2>
<p>When we speak of architecture, we typically invoke the physical: the arrangement of space, the play of light, the weight of materials. But in the digital age, a parallel architecture has arisen—one that shapes behavior, channels attention, and establishes the boundaries of what is possible.</p>
<p>Design systems like Material Design and Apple's Human Interface Guidelines are not merely aesthetic choices. They are governance frameworks, encoding within their specifications a set of values, priorities, and behavioral norms that billions of people experience daily without conscious awareness.</p>
<h2>Algorithmic Authority</h2>
<p>The algorithmic systems that organize our information environment represent perhaps the most consequential form of digital governance. Search rankings, content moderation policies, and recommendation engines collectively determine what ideas gain traction and which remain invisible.</p>
<blockquote>The most powerful architectural decisions are those that feel like no decision at all—the defaults that shape behavior without requiring acknowledgment.</blockquote>
<p>This invisibility is not accidental. It is a feature of systems designed for adoption at scale, where friction is the enemy and seamlessness is the goal. But seamlessness has a cost: it obscures the choices embedded within it.</p>
<h2>Reclaiming Visibility</h2>
<p>Understanding the architecture of digital governance begins with making the invisible visible. This means developing the critical vocabulary to describe these systems, the institutional capacity to audit them, and the cultural willingness to question their premises.</p>`,
    category: 'Technology & Ethics',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    tags: ['design systems', 'governance', 'technology', 'culture'],
    readTime: '12 Min Read',
    featured: true,
    status: 'published',
  },
  {
    title: 'The Revival of Analog Precision in a Post-Pixel World',
    excerpt: 'Why high-end brands are returning to physical printing techniques and Swiss typography to combat digital fatigue.',
    content: `<p>Across the ateliers of Geneva and the studios of Brooklyn, a quiet revolution is underway. After decades of digital dominance, the most forward-thinking designers are turning back to the letterpress, the engraver's tool, and the silkscreen to find a precision that pixels cannot replicate.</p>
<p>The tactile quality of physical print—the slight impression of letterpress type on thick cotton paper, the dimensional quality of thermographic printing—communicates something that even the highest-resolution screen cannot: that something was made with care, that it demanded patience and craft.</p>`,
    category: 'Culture',
    coverImage: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&q=80',
    tags: ['print', 'typography', 'analog', 'design'],
    readTime: '8 Min Read',
    featured: false,
    status: 'published',
  },
  {
    title: 'Grids, Gaps, and The Golden Ratio',
    excerpt: 'Mastering the art of whitespace in modern editorial interfaces to reduce cognitive load and enhance focus.',
    content: `<p>The grid is not a prison—it is a liberation. When Jan Tschichold codified the principles of the New Typography in 1928, he was not imposing constraint but offering freedom: the freedom to make decisions quickly, to trust a system, to focus on what matters.</p>
<p>Modern editorial design has inherited this tradition while adapting it to the demands of the screen. The challenge is different now: where print design contended with the fixed dimensions of paper, digital design must accommodate the infinite variety of screens, orientations, and user preferences.</p>`,
    category: 'Design',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    tags: ['grid', 'whitespace', 'layout', 'design'],
    readTime: '6 Min Read',
    featured: false,
    status: 'published',
  },
  {
    title: 'The Psychology of a Minimalist Desk',
    excerpt: 'How the objects we choose to surround ourselves with shape our thinking, creativity, and capacity for deep work.',
    content: `<p>The desk is a mirror. What we place upon it—what we allow to remain, what we exile to drawers and shelves—reveals our values, our working style, our relationship to distraction and focus.</p>
<p>The minimalist desk is not the absence of objects but their careful curation. It is the result of a sustained interrogation: what earns its place in my field of vision? What contributes to the quality of my thinking, and what merely clutters it?</p>`,
    category: 'Workspace',
    coverImage: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    tags: ['workspace', 'minimalism', 'productivity'],
    readTime: '7 Min Read',
    featured: false,
    status: 'published',
  },
  {
    title: 'Serif vs Sans: The Emotional Weight of Glyphs',
    excerpt: 'Exploring the subconscious signals sent by typeface choices in luxury branding.',
    content: `<p>Every typeface carries emotional freight. The serifed letterforms of Garamond whisper of history, tradition, and the weight of centuries. The geometric precision of Futura speaks of modernity, efficiency, and rational optimism. Neither is superior—they are simply different registers of a visual language.</p>
<p>In luxury branding, typeface selection is among the most consequential design decisions a brand can make. The typeface establishes the emotional register before a single word is read—it communicates the brand's relationship to time, its attitude toward tradition, its sense of its own importance.</p>`,
    category: 'Typography',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    tags: ['typography', 'serif', 'branding', 'design'],
    readTime: '9 Min Read',
    featured: false,
    status: 'published',
  },
  {
    title: 'The Future of Bio-Mimetic Materials',
    excerpt: 'How synthetic biology is creating the next generation of sustainable textiles.',
    content: `<p>In laboratories in Boston and Amsterdam, researchers are growing materials that could not exist in nature—materials that combine the structural efficiency of biological systems with the customizability of industrial manufacturing.</p>
<p>Mycelium-based composites, bacterial cellulose, and spider silk proteins produced in fermentation tanks represent a new paradigm in materials science: one that treats biology not as a source of raw materials to be extracted, but as a design partner to be collaborated with.</p>`,
    category: 'Science',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
    tags: ['science', 'sustainability', 'materials', 'biology'],
    readTime: '10 Min Read',
    featured: false,
    status: 'published',
  },
  {
    title: 'The New Age of Minimalist Architecture in Urban Spaces',
    excerpt: 'As cities become more congested, architects are looking towards minimalist principles to create breathing room.',
    content: `<p>The city has always been a compression of humanity—its desires, its conflicts, its creativity—into the smallest possible space. But in the twenty-first century, that compression has reached new intensities, and architects are responding with a renewed commitment to breathing room.</p>
<p>The minimalist impulse in architecture is not new. From Mies van der Rohe's dictum that "less is more" to the Metabolist experiments of postwar Japan, architects have long sought to find sufficiency in reduction. But the current moment has a different character: less ideological, more pragmatic, more attuned to the actual experience of people living in dense urban environments.</p>`,
    category: 'Architecture',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    tags: ['architecture', 'minimalism', 'urbanism'],
    readTime: '8 Min Read',
    featured: false,
    status: 'published',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Category.deleteMany({});
    await Affiliate.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Julian Thorne',
      email: 'admin@editorial.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created: admin@editorial.com / admin123');

    // Create categories
    await Category.insertMany(categories);
    console.log('Categories seeded');

    // Create affiliates
    await Affiliate.insertMany(affiliates);
    console.log('Affiliates seeded');

    // Create posts
    for (const postData of samplePosts) {
      const post = new Post({ ...postData, author: admin._id, authorName: admin.name });
      await post.save();
    }
    console.log(`${samplePosts.length} posts seeded`);

    console.log('\n✓ Seed complete!');
    console.log('  Admin login: admin@editorial.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
