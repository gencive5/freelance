const Contact = () => (
  <footer className="fixed top-0 left-0 right-0 py-4 text-white text-base z-50 text-center bg-transparent">
    <a
      href="mailto:vic.segen@gmail.com"
      className="mx-2 underline hover:opacity-80 transition-opacity"
      style={{ color: '#1A73E8' }}
    >
      Email
    </a>
    |
    <a
      href="https://instagram.com/gencive5"
      target="_blank"
      rel="noopener noreferrer"
      className="mx-2 underline hover:opacity-80 transition-opacity"
      style={{ color: '#ffffffff' }}
    >
      Instagram
    </a>
  </footer>
);

export default Contact;