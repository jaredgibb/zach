-- Supabase Database Setup Instructions
-- Run these SQL commands in your Supabase SQL Editor: https://app.supabase.com

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create therapists table
CREATE TABLE IF NOT EXISTS therapists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  credentials TEXT NOT NULL,
  title TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  full_bio TEXT NOT NULL,
  fun_fact TEXT,
  specialties TEXT[] DEFAULT '{}',
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_therapists_updated_at BEFORE UPDATE ON therapists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view active therapists" ON therapists
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (is_active = true);

-- Create policies for authenticated admin access
-- Note: You'll need to set up admin users separately
CREATE POLICY "Authenticated users can insert therapists" ON therapists
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update therapists" ON therapists
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete therapists" ON therapists
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert services" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete services" ON services
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data (therapists)
INSERT INTO therapists (name, credentials, title, short_bio, full_bio, fun_fact, specialties, slug, order_index) VALUES
  ('Erin Alexander-Bell', 'MA, LPC', 'Licensed Professional Counselor', 
   'Experienced in individual and family therapy with a compassionate, client-centered approach.',
   'Erin Alexander-Bell is a Licensed Professional Counselor with extensive experience in helping individuals and families navigate life''s challenges. Her approach is warm, compassionate, and tailored to each client''s unique needs and goals.

Erin specializes in working with anxiety, depression, trauma, and relationship issues. She believes in creating a safe, non-judgmental space where clients feel heard and supported throughout their therapeutic journey.

With a master''s degree in counseling and years of clinical experience, Erin uses evidence-based therapeutic approaches including Cognitive Behavioral Therapy (CBT) and person-centered therapy to help clients achieve meaningful change in their lives.',
   'Loves hiking Michigan trails on weekends',
   ARRAY['Anxiety', 'Depression', 'Trauma', 'Relationship Issues'],
   'erin-alexander-bell', 1),
   
  ('Zach Dugger', 'MA, BCBA, LLP', 'Co-Owner/Limited Licensed Psychologist',
   'Co-owner specializing in behavioral psychology and evidence-based therapeutic interventions.',
   'Zach Dugger is a Co-Owner and Limited Licensed Psychologist with specialized training as a Board Certified Behavior Analyst (BCBA). His unique combination of psychological expertise and behavioral science allows him to provide comprehensive, evidence-based treatment.

Zach''s approach integrates traditional psychological principles with applied behavior analysis to help clients achieve measurable, lasting change. He works with individuals across the lifespan, addressing a wide range of concerns including anxiety, behavioral challenges, and life transitions.

With a commitment to staying current with the latest research and best practices, Zach ensures that his clients receive the highest quality of care tailored to their specific needs and goals.',
   'Enjoys woodworking and building furniture',
   ARRAY['Behavioral Psychology', 'Anxiety', 'Life Transitions'],
   'zach-dugger', 2),
   
  ('Melanie Lockett', 'MSW, SST', 'Social Services Technician',
   'Dedicated to supporting individuals and families through comprehensive social services.',
   'Melanie Lockett brings a wealth of knowledge and compassion to her role as a Social Services Technician. With her Master of Social Work degree, she is committed to helping individuals and families access the resources and support they need.

Melanie''s approach is holistic and strengths-based, recognizing that everyone has inherent capabilities that can be leveraged for positive change. She specializes in connecting clients with community resources, providing case management, and offering supportive counseling.

Her experience spans various populations and settings, allowing her to adapt her approach to meet the diverse needs of the community. Melanie is passionate about advocacy and ensuring that all clients receive equitable, quality care.',
   'Volunteers at local animal shelter',
   ARRAY['Case Management', 'Resource Coordination', 'Advocacy'],
   'melanie-lockett', 3),
   
  ('Beyza Niefert', 'LLMSW', 'Limited Licensed Master''s Social Worker',
   'Compassionate social worker focused on empowering clients through evidence-based practices.',
   'Beyza Niefert is a Limited Licensed Master''s Social Worker who brings a fresh perspective and genuine passion to her therapeutic work. She is committed to creating a warm, collaborative environment where clients feel empowered to explore their challenges and work toward their goals.

Beyza''s practice is grounded in evidence-based approaches, including cognitive-behavioral techniques and solution-focused therapy. She has experience working with diverse populations and is particularly skilled in addressing anxiety, depression, life transitions, and relationship challenges.

With cultural sensitivity and an emphasis on the therapeutic relationship, Beyza works alongside her clients to develop practical strategies for managing stress, improving communication, and building resilience.',
   'Speaks three languages fluently',
   ARRAY['Anxiety', 'Depression', 'Life Transitions', 'Relationships'],
   'beyza-niefert', 4),
   
  ('Ian Warnsley', 'MA, LPC', 'Co-Owner/Licensed Professional Counselor',
   'Co-owner dedicated to providing compassionate, effective therapy for individuals and couples.',
   'Ian Warnsley is a Co-Owner and Licensed Professional Counselor with a deep commitment to helping clients achieve meaningful change in their lives. His therapeutic approach is collaborative, strengths-based, and tailored to each individual''s unique circumstances.

Ian specializes in working with individuals and couples facing a variety of challenges, including anxiety, depression, relationship difficulties, and life transitions. He believes that therapy is most effective when it''s a partnership, and he works to create a comfortable, supportive environment where clients feel safe to explore difficult topics.

With advanced training in multiple therapeutic modalities, including Cognitive Behavioral Therapy and Emotionally Focused Therapy, Ian draws on a diverse toolkit to help clients develop new insights, build coping skills, and create lasting positive change.',
   'Plays guitar in a local band',
   ARRAY['Couples Therapy', 'Anxiety', 'Depression', 'Relationships'],
   'ian-warnsley', 5),
   
  ('Aaron Wilson', 'LMSW', 'Licensed Master''s Social Worker',
   'Experienced social worker committed to supporting clients through life''s challenges.',
   'Aaron Wilson is a Licensed Master''s Social Worker who brings both clinical expertise and genuine compassion to his work. He is dedicated to helping clients navigate the complexities of mental health challenges and develop the skills needed for lasting wellness.

Aaron''s approach is client-centered and strengths-based, focusing on empowering individuals to recognize and build upon their existing capabilities. He has experience working with a wide range of issues, including anxiety, depression, trauma, and interpersonal difficulties.

Using evidence-based practices such as Cognitive Behavioral Therapy and Dialectical Behavior Therapy, Aaron helps clients develop practical tools for managing emotions, improving relationships, and creating positive life changes. His warm, non-judgmental style helps clients feel comfortable and supported throughout their therapeutic journey.',
   'Avid cyclist and coffee enthusiast',
   ARRAY['CBT', 'DBT', 'Anxiety', 'Depression', 'Trauma'],
   'aaron-wilson', 6);

-- Insert sample data (services)
INSERT INTO services (title, slug, short_description, full_description, features, order_index) VALUES
  ('Individual Therapy', 'individual-therapy',
   'One-on-one sessions tailored to your personal needs and goals.',
   'Working one-on-one allows for an individual to be open about the situation or situations impacting them and identify strategies to support their goals. Individual therapy provides a safe, confidential space where you can explore your thoughts, feelings, and behaviors with a trained professional.',
   ARRAY['Confidential one-on-one sessions', 'Personalized treatment plans', 'Evidence-based approaches', 'Flexible scheduling'],
   1),
   
  ('Couples Counseling', 'couples-counseling',
   'Helping couples strengthen their relationships and communication.',
   'We respect all individuals in relationships and the need to work through challenges together with a neutral third party. Couples counseling helps partners improve communication, resolve conflicts, and build a stronger, healthier relationship.',
   ARRAY['Neutral, safe environment', 'Communication skill building', 'Conflict resolution', 'Relationship strengthening'],
   2),
   
  ('Family Therapy', 'family-therapy',
   'Support for families working through challenges together.',
   'We work with families in need of finding unity or working through difficulties as it relates to a diagnosis of one of the members of the family. Family therapy addresses family dynamics, improves communication, and helps families navigate challenges together.',
   ARRAY['Family systems approach', 'Improved communication', 'Conflict resolution', 'Support for all family members'],
   3),
   
  ('EAP Services', 'eap-services',
   'Employee Assistance Program services for workplace wellness.',
   'Our Employee Assistance Program (EAP) services provide confidential counseling and support to employees dealing with personal or work-related challenges. We help organizations support their workforce''s mental health and well-being.',
   ARRAY['Confidential employee support', 'Short-term counseling', 'Work-life balance', 'Crisis intervention'],
   4),
   
  ('Cognitive Behavioral Therapy (CBT)', 'cognitive-behavioral-therapy',
   'Evidence-based therapy for changing negative thought patterns.',
   'A type of psychotherapy in which negative patterns of thought about the self and the world are challenged in order to alter unwanted behavior patterns or treat mood disorders such as depression. CBT is highly effective for anxiety, depression, and many other mental health concerns.',
   ARRAY['Evidence-based approach', 'Goal-oriented', 'Skill development', 'Homework assignments'],
   5),
   
  ('Dialectical Behavior Therapy (DBT)', 'dialectical-behavior-therapy',
   'Specially adapted for people who feel emotions very intensely.',
   'Dialectical behaviour therapy (DBT) is a type of talking therapy. It''s based on cognitive behavioural therapy (CBT). But it''s specially adapted for people who feel emotions very intensely. DBT helps individuals develop skills in mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness.',
   ARRAY['Mindfulness training', 'Emotion regulation', 'Distress tolerance', 'Interpersonal effectiveness'],
   6);

-- Create storage bucket for images (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('therapist-images', 'therapist-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);
