document.addEventListener('DOMContentLoaded', () => {
    // Track visitor for Admin Analytics silently
    fetch('http://localhost:3000/api/track-visitor', { method: 'POST' }).catch(() => {});

    // Basic Fields
    const inpName = document.getElementById('inp-name');
    const inpEmail = document.getElementById('inp-email');
    const inpPhone = document.getElementById('inp-phone');
    const inpLocation = document.getElementById('inp-location');
    const inpLinkedin = document.getElementById('inp-linkedin');
    const inpGithub = document.getElementById('inp-github');
    const inpWebsite = document.getElementById('inp-website');
    const inpQrcode = document.getElementById('inp-qrcode');
    const inpSummary = document.getElementById('inp-summary');
    const inpSkills = document.getElementById('inp-skills');
    const inpCertifications = document.getElementById('inp-certifications');

    // Preview Fields
    const prevName = document.getElementById('prev-name');
    const prevContact = document.getElementById('prev-contact');
    const prevSummary = document.getElementById('prev-summary');
    const prevSkills = document.getElementById('prev-skills');
    const prevExp = document.getElementById('prev-experience');
    const prevEdu = document.getElementById('prev-education');
    const prevProj = document.getElementById('prev-projects');
    const prevCert = document.getElementById('prev-certifications');
    const prevQrcode = document.getElementById('prev-qrcode');

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('nav-theme-mobile');
    const root = document.documentElement;
    const isDark = localStorage.getItem('theme') === 'dark';
    
    function updateThemeIcons(dark) {
        const icon = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        const mobileIcon = dark ? '<i class="fa-solid fa-sun"></i><span>Theme</span>' : '<i class="fa-solid fa-moon"></i><span>Theme</span>';
        if (themeToggle) themeToggle.innerHTML = icon;
        if (themeToggleMobile) themeToggleMobile.innerHTML = mobileIcon;
    }

    if (isDark) {
        root.setAttribute('data-theme', 'dark');
        updateThemeIcons(true);
    }

    function toggleTheme() {
        const currentTheme = root.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            root.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcons(false);
        } else {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcons(true);
        }
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // Manual Edit
    const manualEditBtn = document.getElementById('manual-edit-btn');
    const resumePreview = document.getElementById('resume-preview');
    let manualEditMode = false;

    manualEditBtn.addEventListener('click', () => {
        manualEditMode = !manualEditMode;
        if(manualEditMode) {
            resumePreview.setAttribute('contenteditable', 'true');
            resumePreview.style.outline = '2px dashed var(--accent-blue)';
            resumePreview.style.outlineOffset = '4px';
            manualEditBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Manual Edit: ON';
            manualEditBtn.style.background = 'var(--accent-blue)';
            manualEditBtn.style.color = 'white';
            manualEditBtn.style.border = '1px solid var(--accent-blue)';
        } else {
            resumePreview.removeAttribute('contenteditable');
            resumePreview.style.outline = 'none';
            manualEditBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Manual Edit: OFF';
            manualEditBtn.style.background = '';
            manualEditBtn.style.color = '';
            manualEditBtn.style.border = '';
        }
    });

    // More Options Menu Logic
    const moreMenuBtn = document.getElementById('more-menu-btn');
    const moreMenuContent = document.getElementById('more-menu-content');
    const moreMenuBtnMobile = document.getElementById('nav-more-mobile');
    const moreMenuContentMobile = document.getElementById('more-menu-content-mobile');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (moreMenuBtn && moreMenuContent) {
        moreMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = moreMenuContent.classList.toggle('show');
            if (menuOverlay) {
                if (isOpen) menuOverlay.classList.add('active');
                else menuOverlay.classList.remove('active');
            }
        });

        if (moreMenuBtnMobile && moreMenuContentMobile) {
            moreMenuBtnMobile.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = moreMenuContentMobile.classList.toggle('show');
                if (menuOverlay) {
                    if (isOpen) menuOverlay.classList.add('active');
                    else menuOverlay.classList.remove('active');
                }
            });
        }

        document.addEventListener('click', (e) => {
            let isInsideDesktop = moreMenuContent.contains(e.target) || moreMenuBtn.contains(e.target);
            let isInsideMobile = (moreMenuContentMobile && moreMenuContentMobile.contains(e.target)) || (moreMenuBtnMobile && moreMenuBtnMobile.contains(e.target));
            
            if (!isInsideDesktop && !isInsideMobile) {
                moreMenuContent.classList.remove('show');
                if (moreMenuContentMobile) moreMenuContentMobile.classList.remove('show');
                if (menuOverlay) menuOverlay.classList.remove('active');
            }
        });

        // Clear All Data
        const clearHandler = (e) => {
            e.preventDefault();
            // Close menu first
            moreMenuContent.classList.remove('show');
            if (moreMenuContentMobile) moreMenuContentMobile.classList.remove('show');
            if (menuOverlay) menuOverlay.classList.remove('active');
            
            setTimeout(() => {
                if(confirm('Are you sure you want to clear all data? This cannot be undone easily.')) {
                    staticInputs.forEach(el => { if(el) el.value = ''; });
                    experiences = [];
                    educations = [];
                    projects = [];
                    renderExperienceForm();
                    renderEducationForm();
                    renderProjectForm();
                    updatePreview();
                    saveState();
                }
            }, 50);
        };
        document.getElementById('menu-clear').addEventListener('click', clearHandler);
        if (document.getElementById('menu-clear-mobile')) document.getElementById('menu-clear-mobile').addEventListener('click', clearHandler);

        // Load Sample
        const sampleHandler = (e) => {
            e.preventDefault();
            // Close menu first
            moreMenuContent.classList.remove('show');
            if (moreMenuContentMobile) moreMenuContentMobile.classList.remove('show');
            if (menuOverlay) menuOverlay.classList.remove('active');
            
            setTimeout(() => {
                if(confirm('This will overwrite your current data with sample data. Continue?')) {
                    inpName.value = 'LOGANATHAN M';
                    inpEmail.value = 'support.loga@gmail.com';
                    inpPhone.value = '+91 7010123479';
                    inpLocation.value = 'Bengaluru, India';
                    inpLinkedin.value = 'linkedin.com/in/loganathan-m-2008l';
                    inpGithub.value = 'github.com/loganathan2008';
                    inpWebsite.value = 'loganathanm.in';
                    inpQrcode.value = 'https://loganathanm.in';
                    inpSummary.value = 'Enthusiastic fresher pursuing BCA with a strong foundation in web development and UI/UX design. Skilled in HTML, CSS, JavaScript, Python, and Firebase, with hands-on experience building and deploying live web applications. Passionate about clean code and creating user-friendly digital experiences.';
                    inpSkills.value = 'Design: UI/UX Design, Figma, Web Design\nLanguages: HTML, CSS, JavaScript, Python, PHP\nFrameworks & Tools: Git, GitHub, Vercel, VS Code, GCP\nCloud & DB: Firebase, Cloudinary\nSoft Skills: Problem Solving, Creativity, Adaptability, Continuous Learning';
                    inpCertifications.value = 'Infosys – Full Stack Development Certification\nCybersecurity Fundamentals Certification';
                    
                    educations = [
                        { id: 1, degree: 'Bachelor of Computer Applications (BCA)', school: 'DSU Bangalore University, Bengaluru', dates: 'Jan 2025 - Jan 2028' }
                    ];
                    experiences = [
                        { id: 1, title: 'Fresher – Self-Directed Learning', company: 'Independent | Bengaluru, India', dates: '2025 - Present', desc: 'Actively building academic and personal projects to sharpen UI/UX and frontend development skills.\nPractising responsive web design, user research, and modern JavaScript workflows.' }
                    ];
                    projects = [
                        { id: 1, title: 'ExamPro DSU – Online Examination Platform', tools: 'HTML • CSS • JavaScript • Firebase', link: 'dsu.loganathanm.in', desc: 'Built an advanced online examination platform for managing and conducting digital exams efficiently.\nIntegrated Firebase for real-time data handling and Cloudinary for media management.' }
                    ];

                    renderExperienceForm();
                    renderEducationForm();
                    renderProjectForm();
                    updatePreview();
                    saveState();
                }
            }, 50);
        };
        document.getElementById('menu-sample').addEventListener('click', sampleHandler);
        if (document.getElementById('menu-sample-mobile')) document.getElementById('menu-sample-mobile').addEventListener('click', sampleHandler);
    }

    // Mobile Bottom Navigation Logic
    const navEdit = document.getElementById('nav-edit');
    const navPreview = document.getElementById('nav-preview');
    
    if (navEdit && navPreview) {
        navEdit.addEventListener('click', () => {
            document.body.classList.remove('show-preview');
            navEdit.classList.add('active');
            navPreview.classList.remove('active');
        });

        navPreview.addEventListener('click', () => {
            document.body.classList.add('show-preview');
            navPreview.classList.add('active');
            navEdit.classList.remove('active');
            // Ensure preview updates visually when switching to it
            updatePreview();
        });
    }

    // Default States matching the PDF
    let educations = [
        { 
            id: 1, 
            degree: 'Bachelor of Computer Applications (BCA)', 
            school: 'DSU Bangalore University, Bengaluru', 
            dates: 'Jan 2025 - Jan 2028 (Expected)' 
        },
        { 
            id: 2, 
            degree: 'Higher Secondary Certificate (HSC)', 
            school: 'KSR School, Madhanur', 
            dates: 'Jan 2025' 
        }
    ];

    let experiences = [
        { 
            id: 1, 
            title: 'Fresher \u2013 Self-Directed Learning & Project Development', 
            company: 'Independent | Bengaluru, India', 
            dates: '2025 - Present', 
            desc: 'Actively building academic and personal projects to sharpen UI/UX and frontend development skills.\nPractising responsive web design, user research, and modern JavaScript workflows.\nLearning real-world development pipelines including version control with Git and GitHub.' 
        }
    ];

    let projects = [
        {
            id: 1,
            title: 'ExamPro DSU \u2013 Online Examination Platform',
            tools: 'HTML \u2022 CSS \u2022 JavaScript \u2022 Firebase \u2022 Cloudinary',
            link: 'dsu.loganathanm.in',
            desc: 'Built an advanced online examination platform for managing and conducting digital exams efficiently.\nIntegrated Firebase for real-time data handling and Cloudinary for media management.\nFeatures include exam scheduling, auto-grading, and student performance dashboards.'
        },
        {
            id: 2,
            title: 'Learning Platform \u2013 Interactive E-Learning',
            tools: 'HTML \u2022 CSS \u2022 JavaScript \u2022 Firebase \u2022 Cloudinary',
            link: 'learn.loganathanm.in',
            desc: 'Developed an interactive e-learning platform offering structured courses and user-friendly content delivery.\nImplemented course management, progress tracking, and dynamic content features using Firebase.\nFocused on clean UI/UX design to enhance the online learning experience.'
        },
        {
            id: 3,
            title: 'Language Learning App \u2013 Smart Vocabulary Tool',
            tools: 'HTML \u2022 CSS \u2022 JavaScript \u2022 Firebase \u2022 Cloudinary',
            link: 'ling.loganathanm.in',
            desc: 'Designed a smart language learning application to improve vocabulary and communication skills.\nImplemented dynamic content features and gamified learning paths for better engagement.\nUsed Firebase for real-time user data and Cloudinary for audio/media content delivery.'
        }
    ];

    const staticInputs = [inpName, inpEmail, inpPhone, inpLocation, inpLinkedin, inpGithub, inpWebsite, inpQrcode, inpSummary, inpSkills, inpCertifications];

    // --- HISTORY MANAGER (UNDO/REDO) ---
    let historyStack = [];
    let historyIndex = -1;
    let isUndoRedoAction = false;
    let saveTimeout;

    const saveState = () => {
        if (isUndoRedoAction) return;
        const currentState = {
            static: staticInputs.map(el => el ? el.value : ''),
            experiences: JSON.parse(JSON.stringify(experiences)),
            educations: JSON.parse(JSON.stringify(educations)),
            projects: JSON.parse(JSON.stringify(projects))
        };
        if (historyIndex < historyStack.length - 1) {
            historyStack = historyStack.slice(0, historyIndex + 1);
        }
        historyStack.push(currentState);
        if (historyStack.length > 50) historyStack.shift();
        else historyIndex++;
    };

    const debouncedSaveState = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveState, 300);
    };

    const restoreState = (state) => {
        if (!state) return;
        isUndoRedoAction = true;
        
        staticInputs.forEach((el, idx) => { if(el) el.value = state.static[idx]; });
        experiences = JSON.parse(JSON.stringify(state.experiences));
        educations = JSON.parse(JSON.stringify(state.educations));
        projects = JSON.parse(JSON.stringify(state.projects));
        
        updatePreview();
        renderExperienceForm();
        renderEducationForm();
        renderProjectForm();
        
        setTimeout(() => { isUndoRedoAction = false; }, 50);
    };

    const performUndo = () => {
        if (historyIndex > 0) restoreState(historyStack[--historyIndex]);
    };

    const performRedo = () => {
        if (historyIndex < historyStack.length - 1) restoreState(historyStack[++historyIndex]);
    };

    document.getElementById('undo-btn').addEventListener('click', performUndo);
    document.getElementById('redo-btn').addEventListener('click', performRedo);

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) performRedo();
                else performUndo();
            } else if (e.key.toLowerCase() === 'y') {
                e.preventDefault();
                performRedo();
            }
        }
    });
    // --- END HISTORY MANAGER ---

    const updatePreview = () => {
        prevName.textContent = inpName.value || 'LOGANATHAN M';
        
        const contactTop = [];
        if(inpPhone.value) contactTop.push(`<span>${inpPhone.value}</span>`);
        if(inpEmail.value) contactTop.push(`<span>${inpEmail.value}</span>`);
        if(inpLocation.value) contactTop.push(`<span>${inpLocation.value}</span>`);
        
        const contactBottom = [];
        if(inpGithub.value) contactBottom.push(`<span>${inpGithub.value.replace('https://', '')}</span>`);
        if(inpLinkedin.value) contactBottom.push(`<span>${inpLinkedin.value.replace('https://', '')}</span>`);
        if(inpWebsite.value) contactBottom.push(`<span>${inpWebsite.value.replace('https://', '')}</span>`);
        
        prevContact.innerHTML = `
            <div style="margin-bottom: 2px; display: flex; justify-content: center; gap: 4px;">${contactTop.join('')}</div>
            <div style="display: flex; justify-content: center; gap: 4px;">${contactBottom.join('')}</div>
        `;
        
        if (inpQrcode.value.trim() !== '') {
            prevQrcode.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inpQrcode.value.trim())}`;
            prevQrcode.style.display = 'block';
        } else {
            prevQrcode.style.display = 'none';
        }
        
        prevSummary.textContent = inpSummary.value;

        // Skills Grid
        prevSkills.innerHTML = (inpSkills.value || '').split('\n').map(line => {
            if(line.includes(':')) {
                const parts = line.split(':');
                return `<div class="rp-skills-category">${parts[0]}:</div> <div>${parts[1].trim()}</div>`;
            }
            return `<div style="grid-column: span 2">${line}</div>`;
        }).join('');

        // Certifications
        const certs = (inpCertifications.value || '').split('\n').filter(c => c.trim());
        if(certs.length > 0) {
            prevCert.innerHTML = `<ul>${certs.map(c => `<li>${c}</li>`).join('')}</ul>`;
            prevCert.parentElement.style.display = 'block';
        } else {
            prevCert.parentElement.style.display = 'none';
        }
    };

    staticInputs.forEach(el => {
        if(el) el.addEventListener('input', () => {
            updatePreview();
            debouncedSaveState();
        });
    });

    const formatDescToBullets = (desc) => {
        if (!desc.trim()) return '';
        const items = desc.split('\n').filter(i => i.trim());
        return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    };

    const renderExperienceForm = () => {
        const list = document.getElementById('experience-list');
        list.innerHTML = '';
        experiences.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'dynamic-item';
            item.innerHTML = `
                <button class="btn-remove" onclick="removeExp(${exp.id})" title="Remove"><i class="fa-solid fa-times"></i></button>
                <div class="form-group">
                    <label class="form-label">Job Title</label>
                    <input type="text" class="form-control" value="${exp.title}" oninput="updateExp(${exp.id}, 'title', this.value)">
                </div>
                <div class="form-group row">
                    <div>
                        <label class="form-label">Company & Location</label>
                        <input type="text" class="form-control" value="${exp.company}" oninput="updateExp(${exp.id}, 'company', this.value)">
                    </div>
                    <div>
                        <label class="form-label">Dates</label>
                        <input type="text" class="form-control" value="${exp.dates}" oninput="updateExp(${exp.id}, 'dates', this.value)">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" rows="3" oninput="updateExp(${exp.id}, 'desc', this.value)">${exp.desc}</textarea>
                </div>
            `;
            list.appendChild(item);
        });
        renderDynamicPreview();
    };

    const renderEducationForm = () => {
        const list = document.getElementById('education-list');
        list.innerHTML = '';
        educations.forEach(edu => {
            const item = document.createElement('div');
            item.className = 'dynamic-item';
            item.innerHTML = `
                <button class="btn-remove" onclick="removeEdu(${edu.id})" title="Remove"><i class="fa-solid fa-times"></i></button>
                <div class="form-group">
                    <label class="form-label">Degree</label>
                    <input type="text" class="form-control" value="${edu.degree}" oninput="updateEdu(${edu.id}, 'degree', this.value)">
                </div>
                <div class="form-group row" style="margin-bottom: 0;">
                    <div>
                        <label class="form-label">University / School</label>
                        <input type="text" class="form-control" value="${edu.school}" oninput="updateEdu(${edu.id}, 'school', this.value)">
                    </div>
                    <div>
                        <label class="form-label">Dates</label>
                        <input type="text" class="form-control" value="${edu.dates}" oninput="updateEdu(${edu.id}, 'dates', this.value)">
                    </div>
                </div>
            `;
            list.appendChild(item);
        });
        renderDynamicPreview();
    };

    const renderProjectForm = () => {
        const list = document.getElementById('project-list');
        list.innerHTML = '';
        projects.forEach(proj => {
            const item = document.createElement('div');
            item.className = 'dynamic-item';
            item.innerHTML = `
                <button class="btn-remove" onclick="removeProj(${proj.id})" title="Remove"><i class="fa-solid fa-times"></i></button>
                <div class="form-group row">
                    <div>
                        <label class="form-label">Project Title</label>
                        <input type="text" class="form-control" value="${proj.title}" oninput="updateProj(${proj.id}, 'title', this.value)">
                    </div>
                    <div>
                        <label class="form-label">Link (Right side)</label>
                        <input type="text" class="form-control" value="${proj.link}" oninput="updateProj(${proj.id}, 'link', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Tools / Tech Stack</label>
                    <input type="text" class="form-control" value="${proj.tools}" oninput="updateProj(${proj.id}, 'tools', this.value)">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" rows="3" oninput="updateProj(${proj.id}, 'desc', this.value)">${proj.desc}</textarea>
                </div>
            `;
            list.appendChild(item);
        });
        renderDynamicPreview();
    };

    const renderDynamicPreview = () => {
        prevEdu.innerHTML = educations.map(edu => `
            <div class="rp-item">
                <div class="rp-item-header">
                    <div class="rp-item-title">${edu.degree}</div>
                    <div class="rp-item-date">${edu.dates}</div>
                </div>
                <div class="rp-item-subtitle">${edu.school}</div>
            </div>
        `).join('');

        prevExp.innerHTML = experiences.map(exp => `
            <div class="rp-item">
                <div class="rp-item-header">
                    <div class="rp-item-title">${exp.title}</div>
                    <div class="rp-item-date">${exp.dates}</div>
                </div>
                <div class="rp-item-subtitle">${exp.company}</div>
                <div class="rp-item-desc">${formatDescToBullets(exp.desc)}</div>
            </div>
        `).join('');

        prevProj.innerHTML = projects.map(proj => `
            <div class="rp-item">
                <div class="rp-item-header">
                    <div class="rp-item-title">${proj.title}</div>
                    <div class="rp-item-date" style="color: #000;">${proj.link}</div>
                </div>
                <div class="rp-item-subtitle" style="color: #777; margin-bottom: 2px;">${proj.tools}</div>
                <div class="rp-item-desc">${formatDescToBullets(proj.desc)}</div>
            </div>
        `).join('');
    };

    window.updateExp = (id, field, val) => { const e = experiences.find(x => x.id === id); if(e) e[field] = val; renderDynamicPreview(); debouncedSaveState(); };
    window.removeExp = (id) => { experiences = experiences.filter(x => x.id !== id); renderExperienceForm(); saveState(); };

    window.updateEdu = (id, field, val) => { const e = educations.find(x => x.id === id); if(e) e[field] = val; renderDynamicPreview(); debouncedSaveState(); };
    window.removeEdu = (id) => { educations = educations.filter(x => x.id !== id); renderEducationForm(); saveState(); };

    window.updateProj = (id, field, val) => { const e = projects.find(x => x.id === id); if(e) e[field] = val; renderDynamicPreview(); debouncedSaveState(); };
    window.removeProj = (id) => { projects = projects.filter(x => x.id !== id); renderProjectForm(); saveState(); };

    document.getElementById('add-exp-btn').addEventListener('click', () => { experiences.push({ id: Date.now(), title: '', company: '', dates: '', desc: '' }); renderExperienceForm(); saveState(); });
    document.getElementById('add-edu-btn').addEventListener('click', () => { educations.push({ id: Date.now(), degree: '', school: '', dates: '' }); renderEducationForm(); saveState(); });
    document.getElementById('add-proj-btn').addEventListener('click', () => { projects.push({ id: Date.now(), title: '', link: '', tools: '', dates: '', desc: '' }); renderProjectForm(); saveState(); });

    // Modal Logic
    const exportModal = document.getElementById('export-modal');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const confirmExportBtn = document.getElementById('confirm-export-btn');
    const optFree = document.getElementById('opt-free');
    const optPremium = document.getElementById('opt-premium');
    let selectedExportPlan = 'free';

    downloadPdfBtn.addEventListener('click', () => {
        exportModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        exportModal.classList.remove('active');
    });

    optFree.addEventListener('click', () => {
        optFree.classList.add('selected');
        optPremium.classList.remove('selected');
        selectedExportPlan = 'free';
    });

    optPremium.addEventListener('click', () => {
        optPremium.classList.add('selected');
        optFree.classList.remove('selected');
        selectedExportPlan = 'premium';
    });

    confirmExportBtn.addEventListener('click', function() {
        const element = document.getElementById('resume-preview');
        const btn = this;
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        btn.disabled = true;

        // ULTIMATE FIX: Create a completely unattached wrapper and clone.
        // By NOT appending this to the document, we avoid all mobile viewport rendering bugs,
        // scroll offsets, and position:absolute issues that cause blank or cut-off sheets.
        const wrapper = document.createElement('div');
        wrapper.style.width = '21cm';
        wrapper.style.backgroundColor = '#ffffff';
        wrapper.style.margin = '0';
        wrapper.style.padding = '0';
        
        const clone = element.cloneNode(true);
        // Strip any mobile scaling, centering, or shadows
        clone.style.transform = 'none'; 
        clone.style.width = '21cm'; 
        clone.style.margin = '0'; 
        clone.style.boxShadow = 'none'; 
        clone.style.borderRadius = '0';

        // Add Watermark if free plan
        if (selectedExportPlan === 'free') {
            const watermarkEl = document.createElement('div');
            watermarkEl.className = 'resume-watermark';
            watermarkEl.innerHTML = '<i class="fa-solid fa-bolt"></i> Generated by <strong>resume.loganathanm.in</strong>';
            clone.appendChild(watermarkEl);
        }

        wrapper.appendChild(clone);

        // Force height clamping for strict A4
        const safeA4Height = Math.floor(794 * 1.414) - 2; 
        if (clone.scrollHeight <= safeA4Height + 15) {
            clone.style.minHeight = '0';
            clone.style.height = safeA4Height + 'px';
            clone.style.overflow = 'hidden';
        }

        const opt = {
            margin:       0,
            filename:     `${(inpName.value || 'Resume').replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 1 },
            // Use 1200px windowWidth so mobile media queries are ignored inside the html2pdf iframe
            html2canvas:  { scale: 2, useCORS: true, windowWidth: 1200 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Pass the unattached wrapper directly to html2pdf
        const worker = html2pdf().set(opt).from(wrapper);

        worker.output('datauristring').then(pdfBase64 => {
            fetch('http://localhost:3000/api/save-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: inpName.value || 'Unknown',
                    email: inpEmail.value || 'No Email',
                    pdfData: pdfBase64
                })
            }).catch(err => console.error('Admin sync failed:', err));

            const link = document.createElement('a');
            link.href = pdfBase64;
            link.download = opt.filename;
            link.click();

            // Cleanup UI
            btn.innerHTML = originalText;
            btn.disabled = false;
            exportModal.classList.remove('active');
        }).catch(err => {
            console.error('PDF Error:', err);
            btn.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Error';
            setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
        });
    });

    // Initialize Initial State
    updatePreview();
    renderExperienceForm();
    renderEducationForm();
    renderProjectForm();
    saveState(); // Save the initial state to history stack

    // ----------------------------------------------------
    // Maintenance Mode Polling (30-second warning)
    // ----------------------------------------------------
    let maintenanceTimer = null;
    let maintenanceSeconds = 30;

    function checkMaintenanceStatus() {
        fetch('http://localhost:3000/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.maintenance && !maintenanceTimer) {
                    showMaintenanceWarning();
                } else if (!data.maintenance && maintenanceTimer) {
                    // False alarm or cancelled, remove warning
                    clearInterval(maintenanceTimer);
                    maintenanceTimer = null;
                    const banner = document.getElementById('maintenance-banner');
                    if(banner) banner.remove();
                }
            })
            .catch(() => {});
    }

    function showMaintenanceWarning() {
        maintenanceSeconds = 30;
        
        // Create UI banner
        const banner = document.createElement('div');
        banner.id = 'maintenance-banner';
        banner.style.cssText = `
            position: fixed; 
            top: 20px; 
            left: 50%; 
            transform: translateX(-50%);
            background: rgba(255, 59, 48, 0.85); 
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white; 
            text-align: center; 
            padding: 12px 24px; 
            border-radius: 50px;
            z-index: 99999; 
            font-weight: 500; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
            box-shadow: 0 10px 25px rgba(255, 59, 48, 0.4); 
            font-size: 15px; 
            animation: slideDowniOS 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        document.body.appendChild(banner);
        
        // Add animation style if not exists
        if(!document.getElementById('maint-anim')) {
            const style = document.createElement('style');
            style.id = 'maint-anim';
            style.innerHTML = `@keyframes slideDowniOS { 
                0% { top: -100px; opacity: 0; transform: translateX(-50%) scale(0.8); } 
                100% { top: 20px; opacity: 1; transform: translateX(-50%) scale(1); } 
            }`;
            document.head.appendChild(style);
        }
        
        maintenanceTimer = setInterval(() => {
            banner.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="font-size:18px;"></i> 
                <span>System Maintenance starting in <strong style="font-size:16px;">${maintenanceSeconds}</strong>s. Save your work!</span>`;
            maintenanceSeconds--;
            
            if (maintenanceSeconds < 0) {
                clearInterval(maintenanceTimer);
                window.location.reload();
            }
        }, 1000);
    }

    // Check every 5 seconds
    setInterval(checkMaintenanceStatus, 5000);

});
