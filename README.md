# Precision Learning - Tutoring Website

## 🎓 What You've Got

A professional, responsive tutoring website with:
- Modern, distinctive design (not generic AI look)
- Fully functional HTML/CSS/JavaScript
- Mobile-responsive (works on all devices)
- Smooth animations and interactions
- Contact form integration ready

## 📁 Files Included

1. **index.html** - The structure (like a C++ class definition)
2. **styles.css** - The styling (like setting object properties)
3. **script.js** - The interactivity (like class methods)

## 🚀 How to Use This

### Option 1: Test Locally (Easiest)
1. Create a folder on your computer
2. Put all three files in that folder
3. Double-click `index.html` to open in your browser
4. That's it! Your website works offline.

### Option 2: Put It Online (Free with GitHub Pages)

**Step-by-step:**

1. **Create GitHub account** (if you don't have one)
   - Go to github.com
   - Sign up for free

2. **Create a new repository**
   - Click the "+" icon → "New repository"
   - Name it: `yourname-tutoring` (or anything)
   - Make it Public
   - Click "Create repository"

3. **Upload your files**
   - Click "uploading an existing file"
   - Drag and drop all 3 files (index.html, styles.css, script.js)
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Under "Source", select "main" branch
   - Click Save
   - Wait 2-3 minutes

5. **Your site is live!**
   - URL will be: `https://yourusername.github.io/yourname-tutoring`
   - Share this link anywhere!

### Option 3: Other Free Hosting

- **Netlify** (netlify.com) - Drag and drop your folder
- **Vercel** (vercel.com) - Connect your GitHub repo
- **InfinityFree** (infinityfree.net) - Traditional web hosting

## ✏️ Customization Required

You MUST update these before going live:

### 1. WhatsApp Number
In `index.html`, find this line (around line 165):
```html
<a href="https://wa.me/27XXXXXXXXX?text=Hi!%20I'm%20interested%20in%20tutoring"
```
Replace `27XXXXXXXXX` with your actual number (format: country code + number, no spaces)
Example: `27821234567`

### 2. Email Address
Find and replace `youremail@example.com` with your real email (appears twice in index.html)

### 3. Contact Form
The form uses Formspree (free service):
- Go to formspree.io
- Sign up for free
- Create a new form
- Copy your form endpoint
- In index.html line 196, replace `YOUR_FORM_ID` with your actual form ID

Example:
```html
<form class="contact-form" action="https://formspree.io/f/mwpeeabc" method="POST">
```

### 4. Pricing (Optional)
Update the prices in the Pricing section if needed. Current prices are:
- Individual: R250/hour
- Monthly Package: R900/month (4 sessions)
- Group: R150/hour

### 5. Personal Info (Optional)
- Change "Precision Learning" to your preferred business name
- Add your photo (save as `photo.jpg` and add to the About section)
- Adjust the location from "Westonaria" if needed

## 🎨 Understanding the Code

### HTML (index.html)
Think of HTML like C++ structs - it defines the structure:
```html
<section class="hero">  <!-- Like defining a struct -->
    <h1>Title</h1>      <!-- Member variable -->
    <p>Text</p>         <!-- Another member -->
</section>
```

### CSS (styles.css)
CSS is like setting properties:
```css
.hero {
    background: blue;    /* Setting property values */
    padding: 2rem;
}
```

Variables at the top (`:root`) are like C++ constants:
```css
:root {
    --primary: #1a3a52;  /* const string PRIMARY = "#1a3a52"; */
}
```

### JavaScript (script.js)
This is where your programming knowledge shines! It's similar to C++ but simpler:
```javascript
// Like C++ functions
function handleClick() {
    console.log("Clicked!");
}

// Event listeners (like callback functions)
button.addEventListener('click', handleClick);
```

## 🔧 Common Modifications

### Change Colors
In `styles.css`, modify the `:root` section:
```css
:root {
    --primary: #1a3a52;      /* Main color */
    --accent: #ff6b4a;       /* Highlight color */
}
```

### Add More Sections
Copy a section in HTML and modify the content. The structure is:
```html
<section class="your-section">
    <div class="container">
        <h2>Your Title</h2>
        <p>Your content</p>
    </div>
</section>
```

### Change Fonts
In `index.html`, the fonts are loaded from Google Fonts (line 8-10).
Visit fonts.google.com to choose different ones.

## 📱 Mobile Responsive

The website automatically adjusts for:
- Desktop (full layout)
- Tablet (medium layout)
- Mobile (single column)

This is handled in CSS with `@media` queries (like if statements for screen size).

## 🎯 Marketing Your Site

Once live, share on:
1. **WhatsApp Status** - Post your link
2. **Facebook Groups** - Westonaria community groups, parent groups
3. **WhatsApp Groups** - Local community, school alumni
4. **Word of Mouth** - Give business cards with your link

**Pro tip:** Create a short URL:
- Use bit.ly or tinyurl.com
- Example: bit.ly/westonaria-tutor
- Easier to share and remember!

## 🆘 Need Help?

**Common Issues:**

1. **"Styles not loading"**
   - Make sure all 3 files are in the same folder
   - File names must match exactly (case-sensitive)

2. **"Form not working"**
   - Set up Formspree account
   - Update YOUR_FORM_ID in index.html

3. **"WhatsApp link not working"**
   - Update phone number in correct format
   - Must include country code (27 for South Africa)

## 📈 Next Steps

1. **Deploy the site** using one of the hosting options
2. **Update all personal info** (phone, email, form)
3. **Test on mobile** - open on your phone to check
4. **Share the link** on social media
5. **Get your first students**
6. **Add testimonials** as you get them

## 💡 Learning Resources

Want to learn more?
- **HTML/CSS**: w3schools.com (free tutorials)
- **JavaScript**: javascript.info (comprehensive guide)
- **Web Design**: freecodecamp.org (free courses)

## 🎉 You're Ready!

You now have a professional website that cost R0 to build. Your engineering background means you can customize this however you want.

Good luck with your tutoring business! 🚀
