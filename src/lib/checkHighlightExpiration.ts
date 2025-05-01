import connectDB from './mongodb';
import Definition from '@/models/Definition';

export async function checkHighlightExpiration(definitionId: string) {
  try {
    await connectDB();

    const definition = await Definition.findById(definitionId);
    if (!definition) {
      return null;
    }

    // If the definition is highlighted and has an expiration date
    if (definition.isHighlighted && definition.highlightExpiresAt) {
      const now = new Date();
      
      // If the highlight has expired
      if (now > definition.highlightExpiresAt) {
        // Update the definition to remove the highlight
        const updatedDefinition = await Definition.findByIdAndUpdate(
          definitionId,
          {
            isHighlighted: false,
            highlightExpiresAt: null,
          },
          { new: true }
        );
        
        return updatedDefinition;
      }
    }

    return definition;
  } catch (error) {
    console.error('Error checking highlight expiration:', error);
    return null;
  }
} 