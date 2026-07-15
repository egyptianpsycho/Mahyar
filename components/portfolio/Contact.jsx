"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { z } from "zod";
gsap.registerPlugin(ScrollTrigger);
const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  type: z.string().trim().min(1, "Pick a project type").max(50),
  message: z.string().trim().min(5, "Tell me a little more").max(1e3)
});
function Contact() {
  const ref = useRef(null);
  const [values, setValues] = useState({ name: "", email: "", type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact-word", {
        yPercent: 115,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" }
      });
      gsap.from(".contact-field", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-form", start: "top 80%" }
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const errs = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0];
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
    setValues({ name: "", email: "", type: "", message: "" });
  };
  const field = (key, label, type = "text") => {
    const filled = values[key].length > 0;
    const err = errors[key];
    const common = "peer w-full bg-transparent border-b border-foreground/20 pt-6 pb-2 outline-none focus:border-foreground transition-colors";
    return <div className="contact-field relative">
        <label
      className={`absolute left-0 font-mono text-[10px] uppercase tracking-[0.25em] pointer-events-none transition-all duration-300 ${filled ? "top-0 text-foreground/50" : "top-6 text-foreground/40"} peer-focus:top-0 peer-focus:text-accent`}
    >
          {label}
        </label>
        {type === "textarea" ? <textarea
      value={values[key]}
      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      rows={3}
      maxLength={1e3}
      className={`${common} resize-none`}
    /> : type === "select" ? <select
      value={values[key]}
      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      className={`${common} appearance-none`}
    >
            <option value="" />
            <option value="photography">Photography</option>
            <option value="videography">Videography</option>
            <option value="direction">Direction</option>
            <option value="other">Other</option>
          </select> : <input
      type={type}
      value={values[key]}
      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      maxLength={type === "email" ? 255 : 100}
      className={common}
    />}
        {err && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{err}</p>}
      </div>;
  };
  return <section ref={ref} id="contact" className="px-6 md:px-10 pt-32 pb-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-10">[ 08 ] Contact</p>

      <div className="grid md:grid-cols-12 gap-12 md:gap-16">
        {
    /* Left — statement & meta */
  }
        <div className="md:col-span-5">
          <h2 className="font-display uppercase tracking-tighter leading-[0.9] text-[14vw] md:text-[6vw]">
            <span className="block overflow-hidden"><span className="contact-word inline-block">Let's</span></span>
            <span className="block overflow-hidden"><span className="contact-word inline-block">work</span></span>
            <span className="block overflow-hidden"><span className="contact-word inline-block italic font-normal text-accent">together.</span></span>
          </h2>

          <div className="mt-12 space-y-6">
            <a href="mailto:hello@mahyar.studio" className="block font-display text-2xl md:text-3xl underline-offset-8 hover:text-accent hover:underline transition-colors">
              hello@mahyar.studio
            </a>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Berlin / Tehran · GMT+1</p>
            <ul className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.3em]">
              <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Vimeo</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Behance</a></li>
            </ul>
          </div>
        </div>

        {
    /* Right — form */
  }
        <div className="md:col-span-7 md:col-start-6">
          {sent ? <div className="contact-form border-t border-foreground/20 pt-10">
              <p className="font-display text-3xl md:text-4xl leading-tight">
                Message received — I'll be in touch shortly.
              </p>
              <button
    onClick={() => setSent(false)}
    className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] hover:text-accent transition-colors"
  >
                ← Send another
              </button>
            </div> : <form onSubmit={onSubmit} className="contact-form space-y-8" noValidate>
              <div className="grid md:grid-cols-2 gap-8">
                {field("name", "Name")}
                {field("email", "Email", "email")}
              </div>
              {field("type", "Project type", "select")}
              {field("message", "Message", "textarea")}

              <div className="contact-field flex justify-end pt-4">
                <button
    type="submit"
    className="group flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] border border-foreground/30 px-6 py-4 hover:bg-foreground hover:text-background transition-colors"
  >
                  Send message
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </form>}
        </div>
      </div>

      <div className="mt-24 flex flex-col md:flex-row justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground gap-2 pt-8 border-t border-border">
        <span>© 2025 Mahyar Studio · All Rights Reserved</span>
        <span>Built with light & patience</span>
      </div>
    </section>;
}
export {
  Contact
};