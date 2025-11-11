import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function TermsOfService() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold mb-8">TERMS OF SERVICE</h1>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4 mt-0">⚠️ READ THIS FIRST</h2>
                        <p className="text-lg font-semibold mb-4">HOBBY PROJECT. ZERO LIABILITY. ZERO GUARANTEES. ZERO WARRANTIES.</p>

                        <h3 className="mb-2 mt-4">By using this, you agree:</h3>
                        <ul className="mb-4">
                            <li>Service "AS-IS" with all faults</li>
                            <li>May break, lose data, or shut down anytime</li>
                            <li>Your content goes to OpenAI, Google...</li>
                            <li>Everything you post is PUBLIC FOREVER</li>
                            <li>You waive all claims for damages</li>
                        </ul>

                        <p><strong>If you can't accept complete loss of your data with zero compensation → STOP. DON'T USE THIS.</strong></p>
                    </div>

                    <hr className="my-8" />

                    <h2>1. WHAT THIS IS</h2>
                    <p>Echoes is an experimental social platform for sharing historical photos. Run by one person as a hobby.</p>

                    <h3>Features (all experimental, may not work):</h3>
                    <ul>
                        <li>Accounts, photo uploads, AI analysis, location tagging, social features</li>
                    </ul>

                    <h3>Your images are sent to:</h3>
                    <ul>
                        <li>OpenAI (AI analysis - often wrong)</li>
                        <li>Google (moderation - may not catch everything)</li>
                    </ul>

                    <hr className="my-8" />

                    <h2>2. ELIGIBILITY</h2>
                    <p><strong>Age:</strong> 13+. We don't verify. You self-certify.</p>

                    <h3>Your responsibility:</h3>
                    <ul>
                        <li>Account security (100% your responsibility)</li>
                        <li>Everything that happens under your account</li>
                        <li>We're NOT liable for hacking or unauthorized access</li>
                    </ul>

                    <hr className="my-8" />

                    <h2>3. YOUR CONTENT</h2>
                    <p><strong>You own your content.</strong> By posting, you grant us a license to:</p>
                    <ul>
                        <li>Store, display, distribute it</li>
                        <li>Send it to OpenAI and Google for processing</li>
                        <li>Keep it even after you delete your account (if cached by third parties/search engines)</li>
                    </ul>

                    <h3>You promise:</h3>
                    <ul>
                        <li>You own it or have rights to post it</li>
                        <li>It doesn't infringe others' rights</li>
                        <li>It's legal</li>
                    </ul>

                    <p><strong>If someone sues us because of your content, YOU pay all costs.</strong></p>

                    <hr className="my-8" />

                    <h2>4. PROHIBITED CONTENT</h2>
                    <p>Don't post:</p>
                    <ul>
                        <li>Illegal content, malware, copyright infringement</li>
                        <li>Adult content, violence, exploitation of minors</li>
                        <li>Hate speech, harassment, threats</li>
                        <li>False historical information with intent to deceive</li>
                        <li>Private info of others (doxxing)</li>
                        <li>Spam, bots, fake engagement</li>
                    </ul>

                    <h3>Moderation:</h3>
                    <ul>
                        <li>Automated (Google Vision - may not work perfectly)</li>
                        <li>Manual (if we happen to see it)</li>
                        <li><strong>We may remove ANY content for ANY reason (or no reason)</strong></li>
                        <li><strong>We're NOT obligated to monitor, respond to reports, or take action</strong></li>
                    </ul>

                    <hr className="my-8" />

                    <h2>5. LOCATION DATA</h2>

                    <h3>Post Location (PUBLIC):</h3>
                    <ul>
                        <li>You manually select location on map</li>
                        <li><strong>All post locations are PUBLIC - visible on map to everyone</strong></li>
                        <li>May be indexed by search engines</li>
                    </ul>

                    <hr className="my-8" />

                    <h2>6. AI ANALYSIS</h2>
                    <p>Your images are sent to OpenAI for AI analysis.</p>

                    <h3>WARNINGS:</h3>
                    <ul>
                        <li><strong>AI is often WRONG</strong> - automated guessing, not fact-checking</li>
                        <li>May misidentify people, places, dates</li>
                        <li>May generate offensive or inappropriate content</li>
                        <li><strong>We do NOT verify or vouch for AI accuracy</strong></li>
                        <li><strong>We're NOT liable for incorrect or harmful AI outputs</strong></li>
                        <li>OpenAI has their own terms for your data</li>
                    </ul>

                    <hr className="my-8" />

                    <h2>7. THIRD-PARTY SERVICES</h2>
                    <p>We use: Firebase/Google Cloud (all data), OpenAI (images), Google Vision (moderation), Google Maps (locations)...</p>

                    <h3>They have their own terms. We're NOT responsible for:</h3>
                    <ul>
                        <li>Their outages or failures</li>
                        <li>Their data breaches</li>
                        <li>Changes to their terms</li>
                        <li>How they process your data</li>
                    </ul>

                    <p><strong>If they become unavailable, this Service may shut down without notice.</strong></p>

                    <hr className="my-8" />

                    <h2>8. DISCLAIMER OF WARRANTIES</h2>
                    <p><strong>"AS-IS" and "AS-AVAILABLE" - NO WARRANTIES OF ANY KIND.</strong></p>

                    <ul>
                        <li>No warranty of security, accuracy, reliability, or availability</li>
                        <li>May contain bugs, errors, vulnerabilities</li>
                        <li>May lose data or shut down anytime</li>
                        <li>AI analysis is unreliable</li>
                        <li>Content moderation may fail</li>
                    </ul>

                    <p><strong>YOU USE THIS ENTIRELY AT YOUR OWN RISK.</strong></p>

                    <hr className="my-8" />

                    <h2>9. LIMITATION OF LIABILITY</h2>

                    <h3>WE ARE NOT LIABLE FOR:</h3>
                    <ul>
                        <li>Data loss, breaches, hacking</li>
                        <li>Service failures or downtime</li>
                        <li>Inaccurate AI analysis</li>
                        <li>User content or actions</li>
                        <li>Third-party failures</li>
                        <li>Copyright/privacy violations by users</li>
                        <li>ANY damages (direct, indirect, incidental, consequential, punitive)</li>
                    </ul>

                    <p><strong>By using this, you waive all claims for damages.</strong></p>

                    <hr className="my-8" />

                    <h2>10. INDEMNIFICATION</h2>
                    <p><strong>If someone sues us because of your actions, YOU defend us and pay all costs.</strong></p>

                    <p>This includes:</p>
                    <ul>
                        <li>Your content</li>
                        <li>Your violations of these Terms</li>
                        <li>Your violations of others' rights or laws</li>
                        <li>Copyright infringement, privacy violations</li>
                    </ul>

                    <hr className="my-8" />

                    <h2>11. CHANGES</h2>
                    <p><strong>Service:</strong> May change, break, or shut down anytime without notice.</p>
                    <p><strong>Terms:</strong> May change anytime without notice. Changes effective immediately. Check periodically. Continued use = acceptance.</p>

                    <hr className="my-8" />

                    <h2>14. CONTACT</h2>
                    <p><strong>Email:</strong> eyalhe3@gmail.com</p>
                    <p><strong>May not respond. No obligation to help.</strong></p>

                    <hr className="my-8" />

                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-6">
                        <h2 className="mt-0">16. FINAL ACKNOWLEDGMENT</h2>

                        <h3>BY USING THIS, YOU AGREE:</h3>
                        <ol>
                            <li>ZERO liability ($0 maximum)</li>
                            <li>ZERO guarantees (may break/lose data/shut down)</li>
                            <li>ZERO warranties (as-is with all faults)</li>
                            <li>Content goes to OpenAI and Google...</li>
                            <li>Posts are PUBLIC FOREVER</li>
                            <li>AI is unreliable and often wrong</li>
                            <li>May shut down without warning</li>
                            <li>You waive all damage claims</li>
                            <li>You're responsible for your content</li>
                        </ol>

                        <p className="text-lg font-bold mt-4"><strong>THIS IS A HOBBY PROJECT. IF YOU DON'T AGREE, DON'T USE IT.</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsOfService;
