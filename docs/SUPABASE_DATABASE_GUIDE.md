# সুপারবেস ডেটাবেস স্ট্রাকচার এবং API ইন্টিগ্রেশন গাইড

## 📋 প্রকল্প ওভারভিউ

এই ডকুমেন্টে আমরা Skytech Solution Admin প্যানেলের জন্য একটি সম্পূর্ণ ডেটাবেস স্ট্রাকচার এবং API ইন্টিগ্রেশন গাইড তৈরি করব। আমরা Supabase ব্যবহার করে PostgreSQL ডেটাবেস তৈরি করব এবং React ফর্ম থেকে ডেটা সংরক্ষণ এবং আনার পদ্ধতি দেখাব।

## 🗄️ ডেটাবেস টেবিল স্ট্রাকচার

### 1. প্রোফাইল (Profiles) টেবিল

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. হোম পেজ (Home Pages) টেবিল

```sql
CREATE TABLE home_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  banner JSONB NOT NULL,
  journey_with_amco JSONB NOT NULL,
  delivery_skills JSONB NOT NULL,
  trusted_companies JSONB NOT NULL,
  global_certificates JSONB NOT NULL,
  what_we_serve JSONB NOT NULL,
  grab_skilled_employees JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_home_pages_slug ON home_pages(slug);
CREATE INDEX idx_home_pages_created_by ON home_pages(created_by);

-- RLS
ALTER TABLE home_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view home pages" ON home_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage home pages" ON home_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. অ্যাবাউট পেজ (About Pages) টেবিল

```sql
CREATE TABLE about_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  banner JSONB NOT NULL,
  about_section JSONB NOT NULL,
  connecting_manpower JSONB NOT NULL,
  map JSONB NOT NULL,
  certificates JSONB NOT NULL,
  trusted_companies JSONB NOT NULL,
  social_responsibility JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_about_pages_slug ON about_pages(slug);
CREATE INDEX idx_about_pages_created_by ON about_pages(created_by);

-- RLS
ALTER TABLE about_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view about pages" ON about_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage about pages" ON about_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 4. কন্টাক্ট পেজ (Contact Pages) টেবিল

```sql
CREATE TABLE contact_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  banner JSONB NOT NULL,
  form_row JSONB NOT NULL,
  map TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_contact_pages_slug ON contact_pages(slug);
CREATE INDEX idx_contact_pages_created_by ON contact_pages(created_by);

-- RLS
ALTER TABLE contact_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view contact pages" ON contact_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage contact pages" ON contact_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 5. ব্লগ পোস্ট (Blog Posts) টেবিল

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  metadata JSONB,
  author JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_created_by ON blog_posts(created_by);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN (tags);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are viewable by all" ON blog_posts
  FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Admins and editors can manage posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
```

### 6. CSR পেজ (CSR Pages) টেবিল

```sql
CREATE TABLE csr_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  banner JSONB NOT NULL,
  vision JSONB NOT NULL,
  csr_initiative JSONB NOT NULL,
  worker_empowerment JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_csr_pages_slug ON csr_pages(slug);
CREATE INDEX idx_csr_pages_created_by ON csr_pages(created_by);

-- RLS
ALTER TABLE csr_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view CSR pages" ON csr_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage CSR pages" ON csr_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 7. গ্যালারি পেজ (Gallery Pages) টেবিল

```sql
CREATE TABLE gallery_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  banner JSONB NOT NULL,
  gallery JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_gallery_pages_slug ON gallery_pages(slug);
CREATE INDEX idx_gallery_pages_created_by ON gallery_pages(created_by);

-- RLS
ALTER TABLE gallery_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view gallery pages" ON gallery_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage gallery pages" ON gallery_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 8. ইন্ডাস্ট্রিজ পেজ (Industries Pages) টেবিল

```sql
CREATE TABLE industries_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  banner JSONB NOT NULL,
  industries JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_industries_pages_slug ON industries_pages(slug);
CREATE INDEX idx_industries_pages_created_by ON industries_pages(created_by);

-- RLS
ALTER TABLE industries_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view industries pages" ON industries_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage industries pages" ON industries_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 9. সার্ভিস পেজ (Services Pages) টেবিল

```sql
CREATE TABLE services_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  banner JSONB NOT NULL,
  services JSONB NOT NULL,
  industry_section JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_services_pages_slug ON services_pages(slug);
CREATE INDEX idx_services_pages_created_by ON services_pages(created_by);

-- RLS
ALTER TABLE services_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view services pages" ON services_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage services pages" ON services_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 10. ইন্ডিভিজুয়াল সার্ভিস (Individual Services) টেবিল

```sql
CREATE TABLE individual_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_url TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  banner JSONB NOT NULL,
  sub_service JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_individual_services_slug ON individual_services(slug);
CREATE INDEX idx_individual_services_created_by ON individual_services(created_by);

-- RLS
ALTER TABLE individual_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view individual services" ON individual_services
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage individual services" ON individual_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 🔧 API ইন্টিগ্রেশন

### Supabase ক্লায়েন্ট সেটআপ

প্রথমে Supabase ক্লায়েন্ট ইনস্টল করুন:

```bash
npm install @supabase/supabase-js
```

### Supabase কনফিগারেশন

`src/utils/supabase.js` ফাইল তৈরি করুন:

```javascript
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
```

### API সার্ভিস ফাংশন

`src/services/api.js` ফাইল তৈরি করুন:

```javascript
import { supabase } from "../utils/supabase"

// Generic CRUD operations
export const apiService = {
  // Create
  async create(table, data) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      console.error(`Error creating ${table}:`, error)
      return { data: null, error }
    }
  },

  // Read all
  async getAll(table, filters = {}) {
    try {
      let query = supabase.from(table).select("*")

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`Error fetching ${table}:`, error)
      return { data: null, error }
    }
  },

  // Read by ID
  async getById(table, id) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`Error fetching ${table} by ID:`, error)
      return { data: null, error }
    }
  },

  // Update
  async update(table, id, data) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      console.error(`Error updating ${table}:`, error)
      return { data: null, error }
    }
  },

  // Delete
  async delete(table, id) {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error(`Error deleting ${table}:`, error)
      return { error }
    }
  },
}

// Specific service functions
export const homePageService = {
  async createHomePage(data) {
    return apiService.create("home_pages", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getHomePages() {
    return apiService.getAll("home_pages")
  },

  async getHomePage(id) {
    return apiService.getById("home_pages", id)
  },

  async updateHomePage(id, data) {
    return apiService.update("home_pages", id, data)
  },

  async deleteHomePage(id) {
    return apiService.delete("home_pages", id)
  },
}

export const aboutPageService = {
  async createAboutPage(data) {
    return apiService.create("about_pages", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getAboutPages() {
    return apiService.getAll("about_pages")
  },

  async getAboutPage(id) {
    return apiService.getById("about_pages", id)
  },

  async updateAboutPage(id, data) {
    return apiService.update("about_pages", id, data)
  },

  async deleteAboutPage(id) {
    return apiService.delete("about_pages", id)
  },
}

export const contactPageService = {
  async createContactPage(data) {
    return apiService.create("contact_pages", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getContactPages() {
    return apiService.getAll("contact_pages")
  },

  async getContactPage(id) {
    return apiService.getById("contact_pages", id)
  },

  async updateContactPage(id, data) {
    return apiService.update("contact_pages", id, data)
  },

  async deleteContactPage(id) {
    return apiService.delete("contact_pages", id)
  },
}

export const blogPostService = {
  async createBlogPost(data) {
    return apiService.create("blog_posts", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getBlogPosts(filters = {}) {
    return apiService.getAll("blog_posts", filters)
  },

  async getBlogPost(id) {
    return apiService.getById("blog_posts", id)
  },

  async updateBlogPost(id, data) {
    return apiService.update("blog_posts", id, data)
  },

  async deleteBlogPost(id) {
    return apiService.delete("blog_posts", id)
  },

  async getPublishedPosts() {
    return apiService.getAll("blog_posts", { status: "published" })
  },
}

export const csrPageService = {
  async createCsrPage(data) {
    return apiService.create("csr_pages", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getCsrPages() {
    return apiService.getAll("csr_pages")
  },

  async getCsrPage(id) {
    return apiService.getById("csr_pages", id)
  },

  async updateCsrPage(id, data) {
    return apiService.update("csr_pages", id, data)
  },

  async deleteCsrPage(id) {
    return apiService.delete("csr_pages", id)
  },
}

export const galleryPageService = {
  async createGalleryPage(data) {
    return apiService.create("gallery_pages", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getGalleryPages() {
    return apiService.getAll("gallery_pages")
  },

  async getGalleryPage(id) {
    return apiService.getById("gallery_pages", id)
  },

  async updateGalleryPage(id, data) {
    return apiService.update("gallery_pages", id, data)
  },

  async deleteGalleryPage(id) {
    return apiService.delete("gallery_pages", id)
  },
}

export const industriesPageService = {
  async createIndustriesPage(data) {
    return apiService.create("industries_pages", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getIndustriesPages() {
    return apiService.getAll("industries_pages")
  },

  async getIndustriesPage(id) {
    return apiService.getById("industries_pages", id)
  },

  async updateIndustriesPage(id, data) {
    return apiService.update("industries_pages", id, data)
  },

  async deleteIndustriesPage(id) {
    return apiService.delete("industries_pages", id)
  },
}

export const servicesPageService = {
  async createServicesPage(data) {
    return apiService.create("services_pages", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getServicesPages() {
    return apiService.getAll("services_pages")
  },

  async getServicesPage(id) {
    return apiService.getById("services_pages", id)
  },

  async updateServicesPage(id, data) {
    return apiService.update("services_pages", id, data)
  },

  async deleteServicesPage(id) {
    return apiService.delete("services_pages", id)
  },
}

export const individualServiceService = {
  async createIndividualService(data) {
    return apiService.create("individual_services", {
      ...data,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
  },

  async getIndividualServices() {
    return apiService.getAll("individual_services")
  },

  async getIndividualService(id) {
    return apiService.getById("individual_services", id)
  },

  async updateIndividualService(id, data) {
    return apiService.update("individual_services", id, data)
  },

  async deleteIndividualService(id) {
    return apiService.delete("individual_services", id)
  },
}
```

## 📤 ফর্ম থেকে ডেটা সাবমিট করা

### উদাহরণ: HomePageForm এ API ইন্টিগ্রেশন

`src/components/HomePageForm.jsx` এ নিচের পরিবর্তন করুন:

```javascript
import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { homePageService } from "../services/api"
import { supabase } from "../utils/supabase"

const HomePageForm = () => {
  const [formData, setFormData] = useState({
    // ... existing state
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Load existing data if editing
  useEffect(() => {
    const loadHomePage = async () => {
      try {
        const { data, error } = await homePageService.getHomePages()
        if (error) throw error

        if (data && data.length > 0) {
          // Load the first home page for editing
          const homePage = data[0]
          setFormData({
            title: homePage.title,
            slug: homePage.slug,
            banner: homePage.banner,
            journey_with_amco: homePage.journey_with_amco,
            delivery_skills: homePage.delivery_skills,
            trusted_companies: homePage.trusted_companies,
            global_certificates: homePage.global_certificates,
            what_we_serve: homePage.what_we_serve,
            grab_skilled_employees: homePage.grab_skilled_employees,
          })
        }
      } catch (error) {
        console.error("Error loading home page:", error)
        setMessage({ type: "error", text: "Failed to load home page data" })
      }
    }

    loadHomePage()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // Validate required fields
      if (!formData.title || !formData.slug) {
        throw new Error("Title and slug are required")
      }

      // Prepare data for API
      const submitData = {
        title: formData.title,
        slug: formData.slug,
        tags: [], // Add tags if needed
        banner: formData.banner,
        journey_with_amco: formData.journey_with_amco,
        delivery_skills: formData.delivery_skills,
        trusted_companies: formData.trusted_companies,
        global_certificates: formData.global_certificates,
        what_we_serve: formData.what_we_serve,
        grab_skilled_employees: formData.grab_skilled_employees,
      }

      const { data, error } = await homePageService.createHomePage(submitData)

      if (error) throw error

      setMessage({ type: "success", text: "Home page saved successfully!" })

      // Reset form or redirect
      // setFormData(initialState);
    } catch (error) {
      console.error("Error saving home page:", error)
      setMessage({
        type: "error",
        text: error.message || "Failed to save home page",
      })
    } finally {
      setLoading(false)
    }
  }

  // ... existing handlers ...

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Home Page Form</h5>
              {message.text && (
                <div
                  className={`alert alert-${
                    message.type === "success" ? "success" : "danger"
                  } mb-0 py-2 px-3`}
                >
                  {message.text}
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                {/* ... existing form fields ... */}
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      "Save Home Page"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePageForm
```

## 🔐 অথেন্টিকেশন সেটআপ

### Supabase Auth কনফিগারেশন

`src/contexts/AuthContext.jsx` তৈরি করুন:

```javascript
import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../utils/supabase"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      }

      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return data
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### App.js এ AuthProvider যোগ করুন:

```javascript
import { AuthProvider } from "./contexts/AuthContext"
// ... other imports

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>{/* ... existing routes */}</Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

## 📁 ফাইল আপলোড হ্যান্ডলিং

### Supabase Storage সেটআপ

`src/services/storage.js` তৈরি করুন:

```javascript
import { supabase } from "../utils/supabase"

export const storageService = {
  // Upload file to Supabase Storage
  async uploadFile(bucket, file, path) {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = path ? `${path}/${fileName}` : fileName

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return { url: publicUrl, path: filePath, error: null }
    } catch (error) {
      console.error("Error uploading file:", error)
      return { url: null, path: null, error }
    }
  },

  // Delete file from Supabase Storage
  async deleteFile(bucket, path) {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path])

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error("Error deleting file:", error)
      return { error }
    }
  },

  // Get public URL
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)

    return data.publicUrl
  },
}

// Specific upload functions
export const uploadImage = (file, folder = "images") => {
  return storageService.uploadFile("uploads", file, folder)
}

export const uploadDocument = (file, folder = "documents") => {
  return storageService.uploadFile("uploads", file, folder)
}
```

## 🚀 ডেপ্লয়মেন্ট এবং এনভায়রনমেন্ট

### এনভায়রনমেন্ট ভেরিয়েবল

`.env.local` ফাইল তৈরি করুন:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Storage Buckets

Supabase Dashboard এ গিয়ে নিচের buckets তৈরি করুন:

1. **uploads** - সাধারণ ফাইল আপলোডের জন্য
   - Public access enable করুন
   - File size limit: 10MB
   - Allowed file types: images/\*, application/pdf

## 📊 ডেটা ভ্যালিডেশন

### Zod স্কিমা ভ্যালিডেশন

`src/validations/api-validation.js` তৈরি করুন:

```javascript
import { z } from "zod"

// Re-export existing schemas for API validation
export {
  HomePageSchema,
  AboutPageSchema,
  ContactPageSchema,
} from "./full-pages"

// API response validation
export const ApiResponseSchema = z.object({
  data: z.any().nullable(),
  error: z.any().nullable(),
})

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  count: z.number(),
  error: z.any().nullable(),
})

// Form submission validation helpers
export const validateFormData = (schema, data) => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData, error: null }
  } catch (error) {
    return { success: false, data: null, error: error.errors }
  }
}
```

## 🔍 এরর হ্যান্ডলিং এবং লগিং

### এরর বাউন্ডারি কম্পোনেন্ট

`src/components/ErrorBoundary.jsx` তৈরি করুন:

```javascript
import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to external service
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title text-danger">কিছু ভুল হয়েছে</h5>
                  <p className="card-text">
                    পেজ লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পেজ রিফ্রেশ করুন।
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    রিফ্রেশ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

## 📈 পারফরম্যান্স অপটিমাইজেশন

### React Query (TanStack Query) ইন্টিগ্রেশন

```bash
npm install @tanstack/react-query
```

`src/utils/queryClient.js` তৈরি করুন:

```javascript
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: 1,
    },
  },
})
```

## 🔒 সিকিউরিটি বেস্ট প্র্যাকটিস

1. **Environment Variables**: কখনো API keys কোডে হার্ডকোড করবেন না
2. **RLS Policies**: Supabase এ সব টেবিলে RLS enable রাখুন
3. **Input Validation**: সব ইনপুট Zod schema দিয়ে ভ্যালিডেট করুন
4. **File Upload Security**: শুধুমাত্র allowed file types accept করুন
5. **Rate Limiting**: Supabase Dashboard থেকে rate limiting configure করুন
6. **CORS**: শুধুমাত্র আপনার domain থেকে requests allow করুন

## 🎯 কনক্লুশন

এই গাইড অনুসরণ করে আপনি একটি সম্পূর্ণ Supabase-ভিত্তিক CMS তৈরি করতে পারবেন। প্রধান পয়েন্টসমূহ:

- ✅ সম্পূর্ণ ডেটাবেস স্ট্রাকচার
- ✅ API ইন্টিগ্রেশন সার্ভিস
- ✅ অথেন্টিকেশন সিস্টেম
- ✅ ফাইল আপলোড হ্যান্ডলিং
- ✅ এরর হ্যান্ডলিং
- ✅ সিকিউরিটি বেস্ট প্র্যাকটিস

এখন আপনার Skytech Solution Admin প্যানেল প্রোডাকশন-রেডি! 🚀
