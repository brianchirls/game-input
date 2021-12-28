export default class Interaction {
	process(binding/*, action*/) {
		return binding.control.magnitude() > 0 ? 'complete' : 'inactive';
	}

	reset() {}
}
