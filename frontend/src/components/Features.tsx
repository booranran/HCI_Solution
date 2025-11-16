import { Sparkles, User, Eye, BarChart3 } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Size Prediction',
      description: 'Advanced algorithms predict your perfect size across all brands',
      gradient: 'from-accent/20 to-accent/5',
    },
    {
      icon: User,
      title: 'Body-Proportion Analysis',
      description: 'Detailed analysis of your unique body proportions for accurate fits',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      icon: Eye,
      title: 'Virtual Fit Preview',
      description: 'See how clothes will fit before you buy with virtual try-on',
      gradient: 'from-accent/20 to-accent/5',
    },
    {
      icon: BarChart3,
      title: 'Cross-Brand Comparison',
      description: 'Compare sizes across different brands and find the best match',
      gradient: 'from-primary/20 to-primary/5',
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl text-primary">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to find the perfect fit, every time
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-lg text-primary mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
