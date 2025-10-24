import { Text } from 'react-native';
import logger from '@/utils/logger';
import { useHasAccess } from '@/hooks/use-has-access';

interface HasAccessProps {
    allowedRoles: Array<string>
    visible: boolean
    children: any
}

const HasAccess = ({allowedRoles, visible, children }: HasAccessProps) => {
    if(useHasAccess(allowedRoles)) {
        return children;
    } else {
        if(visible) {
            return <Text>Lo siento, no tiene acceso a esta página.</Text>;
        }

        logger.debug("returning null")
        return null;
    }
}

export default HasAccess;
