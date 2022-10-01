export const isGenericElement = (element: any | null) => {
	return (
		element != null &&
		(element.type === 'selection' ||
			element.type === 'rectangle' ||
			element.type === 'diamond' ||
			element.type === 'ellipse')
	);
};

export const isInitializedImageElement = (element: any | null) => {
	return !!element && element.type === 'image' && !!element.fileId;
};

export const isImageElement = (element: any | null) => {
	return !!element && element.type === 'image';
};

export const isTextElement = (element: any | null) => {
	return element != null && element.type === 'text';
};

export const isFreeDrawElement = (element?: any | null) => {
	return element != null && isFreeDrawElementType(element.type);
};

export const isFreeDrawElementType = (elementType: any['type']): boolean => {
	return elementType === 'freedraw';
};

export const isLinearElement = (element?: any | null) => {
	return element != null && isLinearElementType(element.type);
};

export const isLinearElementType = (elementType: any) => {
	return (
		elementType === 'arrow' || elementType === 'line' // || elementType === "freedraw"
	);
};

export const isBindingElement = (
	element?: any | null,
	includeLocked = true
) => {
	return (
		element != null &&
		(!element.locked || includeLocked === true) &&
		isBindingElementType(element.type)
	);
};

export const isBindingElementType = (elementType: any): boolean => {
	return elementType === 'arrow';
};

export const isBindableElement = (
	element: any | null,
	includeLocked = true
) => {
	return (
		element != null &&
		(!element.locked || includeLocked === true) &&
		(element.type === 'rectangle' ||
			element.type === 'diamond' ||
			element.type === 'ellipse' ||
			element.type === 'image' ||
			(element.type === 'text' && !element.containerId))
	);
};

export const isTextBindableContainer = (
	element: any | null,
	includeLocked = true
) => {
	return (
		element != null &&
		(!element.locked || includeLocked === true) &&
		(element.type === 'rectangle' ||
			element.type === 'diamond' ||
			element.type === 'ellipse' ||
			element.type === 'image')
	);
};

export const isany = (element: any): boolean => {
	return (
		element?.type === 'text' ||
		element?.type === 'diamond' ||
		element?.type === 'rectangle' ||
		element?.type === 'ellipse' ||
		element?.type === 'arrow' ||
		element?.type === 'freedraw' ||
		element?.type === 'line'
	);
};

export const hasBoundTextElement = (element: any | null) => {
	return (
		isBindableElement(element) &&
		!!element.boundElements?.some((item: any) => item.type === 'text')
	);
};

export const isBoundToContainer = (element: any | null) => {
	return (
		element !== null && isTextElement(element) && element.containerId !== null
	);
};
