const elCls = (cls) => document.getElementsByClassName(cls);

const collapse = elCls("collapse")[0];
const icon = elCls('hamburger')[0];

icon.addEventListener('click', () => {
 icon.classList.toggle("is-active");
 collapse.classList.toggle("show-collapse");
 if (collapse.classList.contains('show-collapse')) {
  collapse.ariaHidden = false;
  document.body.style.overflow = 'hidden';
 } else {
  collapse.ariaHidden = true;
  document.body.style.overflow = 'auto';
 }
});

collapse.addEventListener('click', function(e) {
 if (e.target.tagName == 'A') {
  document.body.style.overflow = 'auto';
  icon.classList.remove("is-active");
  collapse.classList.toggle('show-collapse')
  collapse.ariaHidden = false;
 }
});

let useIntersectionObserver = false;
if (IntersectionObserver) {
 useIntersectionObserver = true;
}

function observeElem(elem, isVisble, notVisible, unobserve) {
 let observer = new IntersectionObserver(
  function(entries) {
   entries.forEach((entry) => {
    if (entry.isIntersecting) {
     let el = entry.target;
     if (entry.intersectionRatio >= 0.5) {
      isVisble(el);
      unobserve && observer.unobserve(el);
     }
    } else {
     notVisible(entry.target);
    }
   });
  }, {
   rootMargin: "40px",
   threshold: 1.0,
  });

 if (elem.constructor.name.toLowerCase() === 'nodelist') {
  for (let el of elem) {
   observer.observe(el);
  }
 } else {
  observer.observe(elem);
 }
}

function isVisible(elem) {
 let coords = elem.getBoundingClientRect();
 let windowHeight = document.documentElement.clientHeight;
 let topVisible = coords.top > 0 && coords.top < windowHeight;
 let bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;
 return topVisible || bottomVisible;
}

let bottom_contact = document.querySelector('.bottom-contact');

let contact_div = document.querySelector('.contact-div');

let downloadCV = elCls('downloadCV')[0];
let downloadCVBtn = elCls('cm-blue')[0];

if (useIntersectionObserver) {
 observeElem(downloadCV, () => {
  downloadCVBtn.classList.add('bounceInRight');
  downloadCVBtn.style.opacity = '1';
 }, () => null, true);
 observeElem(bottom_contact,
   () => contact_div.style.display = 'none',
   () => contact_div.style.display = 'block'
  );
} else {
 window.addEventListener('scroll', function showDownloadCVBtn() {
  if (isVisible(downloadCVBtn)) {
   window.removeEventListener('scroll', showDownloadCVBtn);
   downloadCVBtn.classList.add('bounceInRight');
  }
 });
 window.addEventListener('scroll', function() {
  if (isVisible(bottom_contact)) {
   contact_div.style.display = 'none';
  } else {
   contact_div.style.display = 'block';
  }
 });
}

let form = document.forms.contact_form;

+
(function() {
 if (!form) return;

 const invalidChar = ['(', ')', '<', '>', '!', '?', '/', '\\', '{', '}', '[', ']'];
 const inputs = form.getElementsByTagName('input');
 for (let input of inputs) {
  input.addEventListener('keyup', function() {
   const val = this.value;
   let last_char = val.substring(val.length - 1);
   if (invalidChar.indexOf(last_char) != -1) {
    this.value = val.slice(0, val.length - 1);
   }
  });
  input.addEventListener('paste', function() {
   setTimeout(() => this.value = Array.from(this.value).filter(key => invalidChar.indexOf(key) == -1).join(''), 0);
  });
 }
})();

const emailScript = document.createElement('script');
emailScript.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";

emailScript.onload = function() {
 if (!form) return;

 emailjs.init("uFRTU9gjM5PBsekhn");

 form.addEventListener('submit', function(e) {
  e.preventDefault();

  let name = form.fullName.value;
  let email = form.email.value;
  let subject = form.subject.value;
  let message = form.message.value;

  if (!subject.trim()) {
   let conf = confirm('You may want to send this message with a subject');
   if (conf) {
    form.subject.focus();
    return;
   }
  }
  if (!message.trim()) return alert('Please enter a message before submitting!');
  let submit = form.getElementsByTagName('button')[0];

  submit.innerText = 'Sending!';

  emailjs.send("service_af1tg34", "template_hd99hbp", {
    name,
    subject: subject || 'New message from your portfolio',
    message,
    reply_to: email,
   })
   .then(function(response) {
    submit.innerText = 'Sent!';
    alert('Message sent. Thanks for reaching out!');
    
    submit.addEventListener('click', function() {
     form.fullName.value = '';
     form.email.value = '';
     form.subject.value = '';
     form.message.value = '';
     this.innerText = 'Submit';
    }, { once: true });
    
   }, function(error) {
    submit.innerText = 'Submit';
   });
 });
};

emailScript.onerror = function() {
 alert('Error loading email service! Please check your internet connection and try again.');
}

document.body.append(emailScript);

let back_to_top = document.getElementById('back-to-top');
back_to_top.onclick = () => document.body.scrollIntoView();

window.addEventListener('scroll', () => {
 if (document.documentElement.scrollTop > window.innerHeight) {
  back_to_top.classList.remove('hide');
 } else {
  back_to_top.classList.add('hide');
 }
});

const cEl = function(elem, props, ...children) {
 try {
  const element = document.createElement(elem);
  if (props) {
   for (let key in props) {
    if (key == 'class') {
     Array.isArray(props[key]) ? props[key].forEach(each => element.classList.add(each)) : element.classList.add(props[key]);
    } else {
     element[key] = props[key];
    }
   }
  }
  children && element.append(...children);
  return element;
 } catch (e) {
  console.error(e.stack);
 }
};

const project_row = elCls('project-row')[0];
const other_projects_ul = elCls('other-projects')[0];

const gitIconSvg = `<svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 496 512" width="1em" height="1em"  xmlns="http://www.w3.org/2000/svg"> <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" /></svg>`;
const externalLinkIconSvg = `<svg stroke="white" fill="white" class='ml-2' stroke-width="0" viewBox="0 0 512 512" width="1em" height="1em"  xmlns="http://www.w3.org/2000/svg"> <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z" /></svg>`;

const project_tools = {
 web_trio: ['HTML', 'CSS', 'JavaScript'],
 gen_project(obj) {
  try {
   let descr;
   if (obj.description.length) {
    const ul = cEl('ul', { class: ['list-unstyled', 'checkMark'] });
    obj.description.forEach(each => ul.appendChild(cEl('li', { class: 'd-flex' },
      cEl('span', { innerText: each })
     )));
    descr = cEl('div', { class: 'flex-grow-1' }, cEl('ul', { class: 'list' }, ul),
     cEl('p', { innerText: `Web technologies used: ${obj.web_technologies.join(', ')}`, ariaLabel: 'Web technologies used' })
    );
   } else {
    descr = cEl('div', { class: 'lis' },
     cEl('p', { class: 'mb-0', ariaLabel: 'Web technologies used', innerText: 'Web technologies used: ' + obj.web_technologies.join(', ') })
    )
   }
   const cardImage = cEl('img', { alt: obj.alt_text || '', ariaDetails: obj.id, src: obj.main_img || '' });

   const cardBottom = cEl('div', { class: ['pt-3'] },
    cEl('a', { href: obj.git_link || '' }, cEl('i', { innerHTML: gitIconSvg }).firstElementChild ),
    cEl('a', { href: obj.view_link || '', class: ['demo', 'p-2', 'px-4', 'ml-3', 'rounded', 'text-center', 'font-weight-bold', 'text-light'] },
     cEl('span', { innerText: 'View' }), cEl('i', { innerHTML: externalLinkIconSvg }).firstElementChild
    )
   );

   descr.append(cardBottom);
   const cardTop = cEl('div', { class: ['row', 'align-items-center', 'mt-5'] },
     cEl('div', { class: ['img-div', 'col-sm-7'] },
      cardImage
     ),
     cEl('div', { class: 'col-sm-5' },
      cEl('h3', { class: ['mt-3', 'mb-3', 'mt-md-0', 'text-center', 'font-weight-bold'], innerText: obj.name }),
      cEl('div', { class: ['d-flex', 'align-items-stretch', 'mt-4', 'mt-md-0'] },
       cEl('div', { class: ['horizontalline'] }),
      descr
      )
     )
    );

   const card = cEl('div', { class: ['pt-2', 'pb-4', 'd-flex'] }, cardTop);

   project_row.appendChild(card);
  } catch (e) {
   console.error(e.stack);
  }
 },
 gen_other_project(obj) {
  other_projects_ul.append(cEl('li', { class: ['pos-rel', 'm-2', 'm-md-4'] },
   cEl('a', { class: 'text-decoration-none', href: obj.href || '' }, cEl('img', { alt: obj.alt || '', class: ['w-100', 'rounded'], src: obj.imgsrc || '' }),
    cEl('h5', { class: ['py-2', obj.color, 'd-block', 'w-100', 'position-absolute', 'font-weight-bold', 'text-center'], textContent: obj.innerText || '' }))
  ));
 }
};

const projects = [
 {
  name: 'Spider',
  main_img: '/static/images/Spider.png',
  alt_text: 'Spider app',
  id: 'spider-app',
  description: ['Automatic design to HTML conversion', 'Responsive CSS Styling', 'Code Generation', 'SEO Optimization Features', 'Effortless Collaboration'],
  web_technologies: project_tools.web_trio.concat(['React', 'NextJS', 'NodeJS', 'Firebase BaaS', 'MongoDB']),
  git_link: 'https://github.com/victorOJILE/spider',
  view_link: ''
 },
 {
  name: 'SwiftEarn',
  main_img: '/static/images/SwiftEarn.png',
  alt_text: 'SwiftEarn affiliate marketing website',
  id: 'swiftearn-app',
  description: ['Affiliate marketing website', 'Discover high-demand products to promote', 'Promote multiple products simultaneously', 'Get paid weekly for your sales'],
  web_technologies: project_tools.web_trio.concat(['Tailwind CSS', 'React', 'NextJS', 'NodeJS', 'Firebase BaaS']),
  git_link: 'https://github.com/victorOJILE/SwiftEarn',
  view_link: ''
 },
 {
  name: 'Sportsreal',
  main_img: '/static/images/Sportsreal-image.PNG',
  alt_text: 'Image showing sportsreal overview',
  id: 'sportsreal-link',
  description: ["Get the latest football news update.", "Football fixtures, results and scores.", "Up to date league tables and information.", "Transfer window updates. etc."],
  web_technologies: project_tools.web_trio.concat(["Bootstrap", "ReactJS", 'NextJS', "NodeJS", "MongoDB"]),
  git_link: 'https://github.com/victorOJILE/Sportsreal.com',
  view_link: ''
 },
 {
  name: 'Financial Markets Charts',
  main_img: '/static/images/Chart-img.PNG',
  alt_text: 'Financial markets chart image',
  id: 'FM-image-link',
  description: ["Get real-time exchange rate for currency pairs, cryptocurrency and stocks.", "Historical data for currency pairs, cryptocurrency and stocks.", "List of top gaining or losing stocks today. etc."],
  web_technologies: project_tools.web_trio.concat(["NodeJS", "ExpressJS"]),
  git_link: 'https://github.com/victorOJILE/Financial-markets-realtime-and-historical-data',
  view_link: ''
 },
 {
  name: 'The Tetris game',
  main_img: '/static/images/tetris.png',
  alt_text: 'Tetris game',
  id: 'tetris',
  description: [],
  web_technologies: project_tools.web_trio.concat(["HTML Canvas"]),
  git_link: 'https://github.com/victorOJILE/Tetris-game-with-javascript',
  view_link: 'https://victorojile.github.io/Tetris-game-with-javascript/'
 },
 {
  name: 'Spotify Login Page Clone',
  main_img: '/static/images/spotify-signup-page.PNG',
  alt_text: 'Spotify desktop sign up page',
  id: 'spotify-sign-up',
  description: [],
  web_technologies: project_tools.web_trio,
  git_link: 'https://github.com/victorOJILE/spotify-desktop-signup-page-clone',
  view_link: '/projects/spotify-signup.html'
 },
 {
  name: 'HotForex Landing Page Clone',
  main_img: '/static/images/Hotforex_img.PNG',
  alt_text: 'HotForex home page clone',
  id: 'hotforex-demo-link',
  description: [],
  web_technologies: project_tools.web_trio,
  git_link: 'https://github.com/victorOJILE/Hotforex-landing-page-clone/blob/main/main.js',
  view_link: ''
 }
];

const other_projects = [
 {
  href: './projects/calendar.html',
  imgsrc: '/static/images/calendar.png',
  alt: 'Calendar',
  innerText: 'Calendar',
  color: 'reddish'
 },
 {
  href: './projects/calculator.html',
  imgsrc: '/static/images/calculator.png',
  alt: 'Calculator',
  innerText: 'Calculator',
  color: 'greenish'
 },
 {
  href: './projects/number-to-word.html',
  imgsrc: '/static/images/number_to_word.png',
  alt: 'Number to word converter',
  innerText: 'Number to word',
  color: 'bluish'
 },
 {
  href: './projects/binary-conv.html',
  imgsrc: '/static/images/bin_dec_hex.png',
  alt: 'BIN DEC HEX Converter',
  innerText: 'BIN DEC HEX Converter',
  color: 'greenish'
 },
 {
  href: './projects/analog-clock.html',
  imgsrc: '/static/images/analog_clock.png',
  alt: 'Analog Clock',
  innerText: 'Analog Clock',
  color: 'bluish'
 }
];

projects.forEach(each => project_tools.gen_project(each));

other_projects.forEach(each => project_tools.gen_other_project(each));

const carousel = elCls('scrollbar')[0];
const prev = elCls('prev')[0];
const next = elCls('next')[0];

prev.addEventListener("click", () => {
 carousel.scrollBy({
  left: -carousel.offsetWidth / 2,
  behavior: "smooth"
 });
});

next.addEventListener("click", () => {
 carousel.scrollBy({
  left: carousel.offsetWidth / 2,
  behavior: "smooth"
 });
});