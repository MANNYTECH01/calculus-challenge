-- Update quiz_settings to have proper explanation control
UPDATE quiz_settings 
SET value = jsonb_build_object(
    'enabled', true,
    'show_immediately_after_attempt', true,
    'show_only_after_date', false,
    'release_date', '2025-08-17T06:00:00Z'
) 
WHERE key = 'show_explanations';

-- Create function to check if explanations should be shown
CREATE OR REPLACE FUNCTION public.can_show_explanations(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    settings JSONB;
    user_attempted BOOLEAN := FALSE;
    release_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get explanation settings
    SELECT value INTO settings FROM quiz_settings WHERE key = 'show_explanations';
    
    -- If settings don't exist or are disabled, return false
    IF settings IS NULL OR (settings->>'enabled')::BOOLEAN = FALSE THEN
        RETURN FALSE;
    END IF;
    
    -- If user_id is provided, check if they attempted the quiz
    IF p_user_id IS NOT NULL THEN
        SELECT has_attempted_quiz INTO user_attempted 
        FROM profiles 
        WHERE user_id = p_user_id;
    END IF;
    
    -- Check different access modes
    IF (settings->>'show_immediately_after_attempt')::BOOLEAN = TRUE THEN
        -- Show if user has attempted (or if no user check needed)
        RETURN (p_user_id IS NULL OR user_attempted = TRUE);
    ELSIF (settings->>'show_only_after_date')::BOOLEAN = TRUE THEN
        -- Show only after release date
        release_date := (settings->>'release_date')::TIMESTAMP WITH TIME ZONE;
        RETURN NOW() >= release_date;
    END IF;
    
    -- Default: follow the basic enabled flag
    RETURN (settings->>'enabled')::BOOLEAN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;